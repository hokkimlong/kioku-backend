import { Test, TestingModule } from '@nestjs/testing';
import { InformationBoardController } from './information-board.controller';

describe('InformationBoardController', () => {
  let controller: InformationBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformationBoardController],
    }).compile();

    controller = module.get<InformationBoardController>(InformationBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
