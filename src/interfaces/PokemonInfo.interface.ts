

export default interface PokemonInfo {
    base_experience: number;
    height: number;
    id: number;
    name: string;
    order: number;
    weight: number;
    sprites: Sprites;
    
}
interface Sprites {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
}