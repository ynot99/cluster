import { randomNumber, sleep, randomEnum } from "./utils";

enum Direction {
   up,
   right,
   down,
   left,
}

type Options = {
   speed: number;
   attempts: number;
   canvasOptions: {
      pixelSize: number;
   };
};

export class FractalField {
   private _field: Array<Array<number>>;
   private _fieldSize: number;
   private _context: CanvasRenderingContext2D;
   private _options: Options;

   constructor(
      fieldSize: number,
      context: CanvasRenderingContext2D,
      options: Partial<Options>
   ) {
      /// Field size
      if (fieldSize < 2) {
         throw new Error("field size cannot be less than 2");
      } else {
         this._fieldSize = fieldSize;
      }

      ///Field
      this._field = [];
      for (let w = 0; w < this._fieldSize; w++) {
         this._field[w] = new Array<number>(this._fieldSize).fill(0);
      }
      const middle = Math.floor(this._fieldSize / 2);
      this._field[middle][middle] = 1;

      /// Output
      this._context = context;

      /// Options
      this._options = Object.assign(
         {
            speed: 500,
            attempts: 100,
            canvasOptions: {
               canvasWidth: 5 * this._fieldSize,
               canvasHeight: 5 * this._fieldSize,
               pixelWidth: 5,
               pixelHeight: 5,
            },
         },
         options
      );
      const canvasSize =
         this._fieldSize * this._options.canvasOptions.pixelSize;
      [this._context.canvas.width, this._context.canvas.height] = [
         canvasSize,
         canvasSize,
      ];
   }

   private drawField() {
      this._context.clearRect(
         0,
         0,
         this._context.canvas.width,
         this._context.canvas.height
      );
      this._field.map((numberArray, zeroIndex) => {
         numberArray.map((numberValue, firstIndex) => {
            if (numberValue === 1) {
               this._context.fillRect(
                  zeroIndex * this._options.canvasOptions.pixelSize,
                  firstIndex * this._options.canvasOptions.pixelSize,
                  this._options.canvasOptions.pixelSize,
                  this._options.canvasOptions.pixelSize
               );
            }
         });
      });
   }

   private movePixel(
      fromCoords: { x: number; y: number },
      toCoords: { x: number; y: number }
   ): void {
      this._context.clearRect(
         fromCoords.x * this._options.canvasOptions.pixelSize,
         fromCoords.y * this._options.canvasOptions.pixelSize,
         this._options.canvasOptions.pixelSize,
         this._options.canvasOptions.pixelSize
      );
      this._context.fillRect(
         toCoords.x * this._options.canvasOptions.pixelSize,
         toCoords.y * this._options.canvasOptions.pixelSize,
         this._options.canvasOptions.pixelSize,
         this._options.canvasOptions.pixelSize
      );
   }

   public async start(): Promise<void> {
      let spawnCounter = 0;
      let topIsDominating: boolean;
      let spawnCoordinates: { dominantCoord: number; tiedCoord: number };
      let moovingXCoord: number, moovingYCoord: number;

      const moveTo = (newX: number, newY: number): void => {
         if (
            newX >= 0 &&
            newX < this._fieldSize &&
            newY >= 0 &&
            newY < this._fieldSize
         ) {
            this._field[moovingXCoord][moovingYCoord] = 0;
            this._field[newX][newY] = 1;

            this.movePixel(
               { x: moovingXCoord, y: moovingYCoord },
               { x: newX, y: newY }
            );

            [moovingXCoord, moovingYCoord] = [newX, newY];
         }
      };
      const isNear = (): boolean => {
         if (moovingYCoord - 1 > 0) {
            if (this._field[moovingXCoord][moovingYCoord - 1] === 1) {
               return true;
            }
         }
         if (moovingXCoord + 1 < this._fieldSize - 1) {
            if (this._field[moovingXCoord + 1][moovingYCoord] === 1) {
               return true;
            }
         }
         if (moovingYCoord + 1 < this._fieldSize - 1) {
            if (this._field[moovingXCoord][moovingYCoord + 1] === 1) {
               return true;
            }
         }
         if (moovingXCoord - 1 > 0) {
            if (this._field[moovingXCoord - 1][moovingYCoord] === 1) {
               return true;
            }
         }
         return false;
      };

      while (spawnCounter <= this._options.attempts) {
         spawnCoordinates = {
            dominantCoord: randomNumber(0, this._fieldSize - 1),
            tiedCoord: randomNumber() === 0 ? 0 : this._fieldSize - 1,
         };

         topIsDominating = randomNumber() === 1;

         [moovingXCoord, moovingYCoord] = topIsDominating
            ? [spawnCoordinates.dominantCoord, spawnCoordinates.tiedCoord]
            : [spawnCoordinates.tiedCoord, spawnCoordinates.dominantCoord];

         console.log([moovingXCoord, moovingYCoord]);

         this.drawField(); // TODO it should be removed
         spawnCounter++;
         while (!isNear()) {
            await sleep(this._options.speed);
            const rEnum = randomEnum(Direction);

            console.log(Direction[rEnum]);

            switch (rEnum) {
               case Direction.up:
                  moveTo(moovingXCoord, moovingYCoord - 1);
                  break;
               case Direction.right:
                  moveTo(moovingXCoord + 1, moovingYCoord);
                  break;
               case Direction.down:
                  moveTo(moovingXCoord, moovingYCoord + 1);
                  break;
               case Direction.left:
                  moveTo(moovingXCoord - 1, moovingYCoord);
                  break;
            }
         }
      }
   }
}
