export type Game = {
    id: string;
    rawgId: number;
    title: string;
    genres: string[];
    completed: boolean;
    image?: string | null;
    released?: string | null;
};

export type RawgGame = {
    id: number;
    name: string;
    genres: { name: string }[];
    released?: string;
    background_image?: string | null;
};