import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: number[];
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  posterPath: {
    type: String,
    required: true
  },
  backdropPath: {
    type: String
  },
  releaseDate: {
    type: String,
    required: true
  },
  voteAverage: {
    type: Number,
    default: 0
  },
  genres: [{
    type: Number
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
