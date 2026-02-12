import { Router } from 'express';
import movieController from '../controllers/movie.controller';

const router = Router();

router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);

export default router;
