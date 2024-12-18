enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER"
}

enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED"
}

interface HeroStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}

interface Hero {
    id: number;
    name: string;
    type: HeroType;
    attackType: AttackType;
    stats: HeroStats;
    isAlive: boolean;
}

type AttackResult = {
    damage: number;
    isCritical: boolean;
    remainingHealth: number;
};

let heroIdCounter = 1;

function createHero(name: string, type: HeroType): Hero {
    let baseStats: HeroStats;

    switch (type) {
        case HeroType.Warrior:
            baseStats = { health: 120, attack: 15, defense: 10, speed: 5 };
            return {
                id: heroIdCounter++,
                name,
                type,
                attackType: AttackType.Physical,
                stats: baseStats,
                isAlive: true
            };
        case HeroType.Mage:
            baseStats = { health: 80, attack: 25, defense: 5, speed: 8 };
            return {
                id: heroIdCounter++,
                name,
                type,
                attackType: AttackType.Magical,
                stats: baseStats,
                isAlive: true
            };
        case HeroType.Archer:
            baseStats = { health: 100, attack: 18, defense: 7, speed: 10 };
            return {
                id: heroIdCounter++,
                name,
                type,
                attackType: AttackType.Ranged,
                stats: baseStats,
                isAlive: true
            };
        default:
            throw new Error("Invalid hero type");
    }
}

function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const baseDamage = attacker.stats.attack - defender.stats.defense;
    const adjustedDamage = Math.max(baseDamage, 1);

    const isCritical = Math.random() < 0.2;
    const totalDamage = isCritical ? adjustedDamage * 2 : adjustedDamage;

    defender.stats.health -= totalDamage;
    if (defender.stats.health <= 0) {
        defender.stats.health = 0;
        defender.isAlive = false;
    }

    return {
        damage: totalDamage,
        isCritical,
        remainingHealth: defender.stats.health
    };
}

function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.find((hero) => hero[property] === value);
}

function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `One of the heroes is already defeated.`;
    }

    const attacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
    const defender = attacker === hero1 ? hero2 : hero1;

    const attackResult = calculateDamage(attacker, defender);
    const status = `${attacker.name} attacks ${defender.name} and deals ${attackResult.damage} damage${attackResult.isCritical ? " (Critical Hit!)" : ""}. ${defender.name}'s health is now ${attackResult.remainingHealth}.`;

    if (!defender.isAlive) {
        return `${status} ${defender.name} is defeated!`;
    }

    return status;
}

const heroes: Hero[] = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леона", HeroType.Archer)
];

function fullBattle(hero1: Hero, hero2: Hero): string {
    let battleLog = "";
    while (hero1.isAlive && hero2.isAlive) {
        battleLog += battleRound(hero1, hero2) + "\n";
    }

    if (!hero1.isAlive) {
        battleLog += `${hero1.name} був переможений! Переможець: ${hero2.name}`;
    } else if (!hero2.isAlive) {
        battleLog += `${hero2.name} був переможений! Переможець: ${hero1.name}`;
    }

    return battleLog;
}

let totalDamage = 0;
let criticalHits = 0;

function calculateBattleStats(attacker: Hero, defender: Hero) {
    const attackResult = calculateDamage(attacker, defender);
    totalDamage += attackResult.damage;
    if (attackResult.isCritical) criticalHits++;
    return attackResult;
}

console.log("--- Battle Start ---");
console.log(fullBattle(heroes[0], heroes[1]));

const foundHero = findHeroByProperty(heroes, "type", HeroType.Mage);
console.log("\nFound hero:", foundHero);

console.log("\nFinal Heroes State:", heroes);
console.log(`\nTotal Damage Dealt: ${totalDamage}`);
console.log(`Critical Hits: ${criticalHits}`);

// Тестовий сценарій гри
const hero1 = createHero("Дмитро", HeroType.Warrior);
const hero2 = createHero("Мерлін", HeroType.Mage);
const hero3 = createHero("Леона", HeroType.Archer);

console.log("=== Створені герої ===");
console.log(hero1);
console.log(hero2);
console.log(hero3);

console.log("\n=== Початок бою ===");
console.log(fullBattle(hero1, hero2));

console.log("\n=== Пошук героя ===");
const foundMage = findHeroByProperty([hero1, hero2, hero3], "type", HeroType.Mage);
console.log("Знайдений герой:", foundMage);

console.log("\n=== Стан героїв після бою ===");
console.log(hero1);
console.log(hero2);
console.log(hero3);

console.log(`\nЗагальний нанесений урон: ${totalDamage}`);
console.log(`Кількість критичних ударів: ${criticalHits}`);