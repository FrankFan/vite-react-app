import React, { memo } from 'react';
import { CloseButton } from 'react-bootstrap';
import Konami from 'react-konami-code';
import { FaucetAppNetworkInfo } from './shared/models/types';
import './assets/css/Easter.css';

const chainrunner =
  'https://goerlifaucet.com/static/media/chainrunner.fd1307a3.png';
const boredape = 'https://goerlifaucet.com/static/media/boredape.6cb8770e.png';
const boredape2 =
  'https://goerlifaucet.com/static/media/boredape2.2aa44cc8.png';
const coolcat = 'https://goerlifaucet.com/static/media/coolcat.cf51a816.png';
const punk = 'https://goerlifaucet.com/static/media/punk.081323df.png';
const wow = 'https://goerlifaucet.com/static/media/wow.10594c7e.png';

let GLOBAL_EE_ANIMATION_FRAME = -1;

export const EASTER_EGG_SUBJECTS = (
  network: string,
  tokenName: string
): EasterEggSubjects[] => [
  {
    imageSrc: chainrunner,
    tagline: 'Mega City awaits your smart contract deployment, Runner.',
  },
  {
    imageSrc: boredape,
    tagline: `Now you can donate your new ${network} ${tokenName} to the ape wildlife fund.`,
  },
  {
    imageSrc: boredape2,
    tagline: `Now you can donate your new ${network} ${tokenName} to the ape wildlife fund.`,
  },
  {
    imageSrc: coolcat,
    tagline: `Hello fren. Will you spend that ${network} ${tokenName} on your pet, or your next dapp?`,
  },
  {
    imageSrc: punk,
    tagline: `Here's to the misfits and the punks. Enjoy your ${network} ${tokenName}, builder.`,
  },
  {
    imageSrc: wow,
    tagline: `Use this ${network} ${tokenName} to bring representation, inclusivity, and equal opportunities to Web3!`,
  },
];

export const EASTER_EGG_DROP_COLORS = [
  'random',
  'gold',
  'red',
  'blue',
  'green',
];

function calculateBrightness(red: number, green: number, blue: number) {
  return Math.sqrt(
    red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
  );
}

export interface EasterEggSubjects {
  tagline: string;
  imageSrc: string;
}

interface EasterEggRenderProps {
  onClickExit?: () => void;
  show: boolean;
  transactionUrl: string;
  config: EasterEggConfiguration;
  subject: EasterEggSubjects;
  dropFill: string;
  appNetworkInfo: FaucetAppNetworkInfo;
}

interface EasterEggConfiguration {
  initialVelocityCap: number;
  dropSizeCap: number;
  dropSizeFloor: number;
  detail: number;
  backgroundFill: string;
}

class Particle {
  x: number;
  y: number;
  speed: number;
  velocity: number;
  size: number;
  ctx: CanvasRenderingContext2D | null;
  color: string;

  constructor(
    public readonly canvas: HTMLCanvasElement,
    public readonly grid: number[][],
    public readonly easterEggData: EasterEggRenderProps
  ) {
    this.x = Math.random() * canvas.clientWidth;
    this.y = 0;
    this.speed = 0;
    this.velocity = Math.random() * easterEggData.config.initialVelocityCap;
    this.size =
      Math.random() * easterEggData.config.dropSizeCap +
      easterEggData.config.dropSizeFloor;
    this.ctx = canvas.getContext('2d');
    if (this.easterEggData.dropFill === 'random') {
      this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 1)`;
    } else {
      this.color = this.easterEggData.dropFill;
    }
  }
  update() {
    const yI = Math.floor(
      this.y ? this.y : 0 / this.easterEggData.config.detail
    );
    const xI = Math.floor(
      this.x ? this.x : 0 / this.easterEggData.config.detail
    );
    if (this.grid.length > yI) {
      if (this.grid[yI].length > xI) {
        this.speed = this.grid[yI][xI];
      }
    }
    const movement = 2.5 - this.speed + this.velocity;
    this.y += movement;
    if (this.y >= this.canvas.height) {
      this.y = 0;
      this.x = Math.random() * this.canvas.width;
    }
  }
  draw() {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.color;
      this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }
}

function beginEasterEgg(
  canvas: HTMLCanvasElement,
  props: EasterEggRenderProps
): void {
  const image = new Image();
  image.src = props.subject.imageSrc;
  image.addEventListener('load', function () {
    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('class', 'stop-scrolling');
    window.scrollTo(0, 0);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const particlesArray: Particle[] = [];
    const numberOfParticles = 12000;
    const detail = 1;

    if (image.naturalHeight < image.naturalWidth) {
      const imageWidth = canvas.width * 0.5;
      const imageHeight =
        canvas.width * 0.5 * (image.naturalHeight / image.naturalWidth);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        (canvas.width - imageWidth) / 2,
        (canvas.height - imageHeight) / 2,
        imageWidth,
        imageHeight
      );
    } else {
      const imageHeight = canvas.height * 0.5;
      const imageWidth =
        canvas.height * 0.5 * (image.naturalWidth / image.naturalHeight);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        (canvas.width - imageWidth) / 2,
        (canvas.height - imageHeight) / 2,
        imageWidth,
        imageHeight
      );
    }

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grid: number[][] = [];
    for (let y = 0; y < canvas.height; y += detail) {
      const row = [];
      for (let x = 0; x < canvas.width; x += detail) {
        const red = pixels.data[y * 4 * pixels.width + x * 4];
        const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
        const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
        const brightness = calculateBrightness(red, green, blue) / 100;
        row.push(brightness !== 0 ? brightness : 1);
      }
      grid.push(row);
    }

    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(canvas, grid, props));
      }
    }
    init();

    function animate() {
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = props.config.backgroundFill;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0;
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        ctx.globalAlpha = particlesArray[i].speed * 0.3;
        particlesArray[i].draw();
      }
      GLOBAL_EE_ANIMATION_FRAME = requestAnimationFrame(animate);
    }
    animate();
  });
}

function cleanUp(canvas: HTMLCanvasElement) {
  const body = document.getElementsByTagName('body')[0];
  body.setAttribute('class', '');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(GLOBAL_EE_ANIMATION_FRAME);
}

export function EasterEggComponent(props: EasterEggRenderProps): JSX.Element {
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvasElement = canvas.current;
    if (props.show && canvas.current) {
      beginEasterEgg(canvas.current, props);
      window.addEventListener('resize', resize);
    }
    return () => {
      if (canvasElement) {
        window.removeEventListener('resize', resize);
        cleanUp(canvasElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  function resize(): void {
    const canvasElement = canvas.current;
    if (!canvasElement) {
      return;
    }
    cleanUp(canvasElement);
    beginEasterEgg(canvasElement, props);
  }

  return (
    <div
      className="egg-content"
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        top: 0,
        left: 0,
        display: 'flex',
      }}
    >
      <canvas
        ref={canvas}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      ></canvas>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
          justifyContent: 'start',
          padding: '30px',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '1.5em',
            left: '1.5em',
          }}
          onClick={props.onClickExit}
        >
          <CloseButton
            className="egg-button"
            style={{
              backgroundSize: '1.5em',
              width: '1.5em',
              height: '1.5em',
            }}
            variant="white"
          />
        </span>
        <h3
          style={{
            font: 'mono',
            color: 'white',
            textAlign: 'center',
            padding: '0px 40px 15px 40px',
          }}
        >
          {props.subject.tagline}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p
            style={{
              margin: 0,
              fontWeight: 'bold',
            }}
          >
            Support {props.appNetworkInfo.url} with a{' '}
          </p>
        </div>
      </div>
    </div>
  );
}

const EasterEggContainer = memo(function EasterEggContainer({
  showEaster,
  responder,
  transactionUrl,
  appNetwork,
}: {
  showEaster: boolean;
  responder: (showState: boolean) => void;
  transactionUrl: string;
  appNetwork: FaucetAppNetworkInfo;
}) {
  const easter_egg_network_subject = EASTER_EGG_SUBJECTS(
    appNetwork.networkDisplayName,
    appNetwork.tokenName
  );
  const easterEggSubject =
    easter_egg_network_subject[
      Math.floor(Math.random() * easter_egg_network_subject.length)
    ];
  const easterEggDropFill =
    EASTER_EGG_DROP_COLORS[
      Math.floor(Math.random() * EASTER_EGG_DROP_COLORS.length)
    ];
  return (
    <div className={showEaster ? 'basket' : 'basket hide'}>
      {!showEaster && (
        <Konami
          action={() => {
            responder(true);
          }}
        />
      )}
      <EasterEggComponent
        onClickExit={() => {
          responder(false);
        }}
        show={showEaster}
        transactionUrl={transactionUrl}
        subject={easterEggSubject}
        dropFill={easterEggDropFill}
        config={{
          initialVelocityCap: 5,
          dropSizeCap: 1,
          dropSizeFloor: 0.1,
          detail: 1,
          backgroundFill: 'rgba(0, 0, 0, 0.5)',
        }}
        appNetworkInfo={appNetwork}
      />
    </div>
  );
});

export default EasterEggContainer;
