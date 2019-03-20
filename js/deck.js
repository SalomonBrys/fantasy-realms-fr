var deck = {
  cards: [{
      id: 1,
      suit: 'Terrain',
      name: 'Montagne',
      strength: 9,
      bonus: '+50 avec la <span class="weather">Fumée</span> et le <span class="flame">Feu de Forêt</span>. <br />EFFACE le malus de toutes les <span class="flood">Vagues</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Fumée') && hand.contains('Feu de Forêt') ? 50 : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === 'Vague';
      },
      relatedSuits: ['Vague'],
      relatedCards: ['Fumée', 'Feu de Forêt']
    },
    {
      id: 2,
      suit: 'Terrain',
      name: 'Caverne',
      strength: 6,
      bonus: '+25 avec l\'<span class="army">Infanterie Naine</span> ou le <span class="beast">Dragon</span>. <br />EFFACE le malus de tous les <span class="weather">Climats</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Infanterie Naine') || hand.contains('Dragon') ? 25 : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === 'Climat';
      },
      relatedSuits: ['Climat'],
      relatedCards: ['Infanterie Naine', 'Dragon']
    },
    {
      id: 3,
      suit: 'Terrain',
      name: 'Beffroi',
      strength: 8,
      bonus: '+15 avec n\'importe quel <span class="wizard">Sorcier</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Sorcier') ? 15 : 0;
      },
      relatedSuits: ['Sorcier'],
      relatedCards: []
    },
    {
      id: 4,
      suit: 'Terrain',
      name: 'Forêt',
      strength: 7,
      bonus: '+12 pour les <span class="army">Archers Elfes</span> et pour chaque <span class="beast">Créature</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 12 * hand.countSuit('Créature') + (hand.contains('Archers Elfes') ? 12 : 0);
      },
      relatedSuits: ['Créature'],
      relatedCards: ['Archers Elfes']
    },
    {
      id: 5,
      suit: 'Terrain',
      name: 'Élémental de Terre',
      strength: 4,
      bonus: '+15 pour chaque autre <span class="land">Terrain</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Terrain', this.id);
      },
      relatedSuits: ['Terrain'],
      relatedCards: []
    },
    {
      id: 6,
      suit: 'Vague',
      name: 'Source de Vie',
      strength: 1,
      bonus: 'Ajoutez la force de base de n\'importe quel <span class="land">Terrain</span>, <span class="weapon">Arme</span>, <span class="flood">Vague</span>, <span class="flame">Flamme</span> ou <span class="weather">Climat</span> de votre main.',
      penalty: null,
      bonusScore: function(hand) {
        var max = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.suit === 'Arme' || card.suit === 'Vague' || card.suit === 'Flamme' || card.suit === 'Terrain' || card.suit === 'Climat') {
            if (card.strength > max) {
              max = card.strength;
            }
          }
        }
        return max;
      },
      relatedSuits: ['Arme', 'Vague', 'Flamme', 'Terrain', 'Climat'],
      relatedCards: []
    },
    {
      id: 7,
      suit: 'Vague',
      name: 'Marécage',
      strength: 18,
      bonus: null,
      penalty: '-3 pour chaque <span class="army">Armée</span> et <span class="flame">Flamme</span>.',
      penaltyScore: function(hand) {
        var penaltyCards = hand.countSuit('Flamme');
        if (!(hand.containsId(25) || hand.containsId(41))) { // these clear the word 'Armée' from the penalty
          penaltyCards += hand.countSuit('Armée');
        }
        return -3 * penaltyCards;
      },
      relatedSuits: ['Armée', 'Flamme'],
      relatedCards: []
    },
    {
      id: 8,
      suit: 'Vague',
      name: 'Inondation',
      strength: 32,
      bonus: null,
      penalty: 'MASQUE toutes les <span class="army">Armées</span>, tous les <span class="land">Terrains</span> sauf la <span class="land">Montagne</span>, et toutes les <span class="flame">Flammes</span> sauf l\'<span class="flame">Éclair</span>.',
      blanks: function(card, hand) {
        return (card.suit === 'Armée' && !(hand.containsId(25) || hand.containsId(41))) || // these clear the word 'Armée' from the penalty
          (card.suit === 'Terrain' && card.name !== 'Montagne') ||
          (card.suit === 'Flamme' && card.name !== 'Éclair');
      },
      relatedSuits: ['Armée', 'Terrain', 'Flamme'],
      relatedCards: ['Montagne', 'Éclair']
    },
    {
      id: 9,
      suit: 'Vague',
      name: 'Île',
      strength: 14,
      bonus: 'EFFACE les malus de n\'importe quelle <span class="flood">Vague</span> ou <span class="flame">Flamme</span>.',
      penalty: null,
      action: 'Choisissez une Vague ou une Flamme de votre main.',
      relatedSuits: ['Vague', 'Flamme'],
      relatedCards: []
    },
    {
      id: 10,
      suit: 'Vague',
      name: 'Élémental d\'eau',
      strength: 4,
      bonus: '+15 pour chaque autre <span class="flood">Vague</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Vague', this.id);
      },
      relatedSuits: ['Vague'],
      relatedCards: []
    },
    {
      id: 11,
      suit: 'Climat',
      name: 'Orage',
      strength: 8,
      bonus: '+10 pour chaque autre <span class="flood">Vague</span>.',
      penalty: 'MASQUE toutes les <span class="flame">Flammes</span> sauf l\'<span class="flame">Éclair</span>.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Vague');
      },
      blanks: function(card, hand) {
        return card.suit === 'Flamme' && card.name !== 'Éclair';
      },
      relatedSuits: ['Vague', 'Flamme'],
      relatedCards: ['Éclair']
    },
    {
      id: 12,
      suit: 'Climat',
      name: 'Blizzard',
      strength: 30,
      bonus: null,
      penalty: 'MASQUE toutes les <span class="flood">Vagues</span>. <br />-5 pour chaque <span class="army">Armée</span>, <span class="leader">Seigneur</span>, <span class="beast">Créature</span>, et <span class="flame">Flamme</span>.',
      penaltyScore: function(hand) {
        var penaltyCards = hand.countSuit('Seigneur') + hand.countSuit('Créature') + hand.countSuit('Flamme');
        if (!hand.containsId(25)) { // clears the word 'Armée' from the penalty
          penaltyCards += hand.countSuit('Armée');
        }
        return -5 * penaltyCards;
      },
      blanks: function(card, hand) {
        return card.suit === 'Vague';
      },
      relatedSuits: ['Seigneur', 'Créature', 'Flamme', 'Armée', 'Vague'],
      relatedCards: []
    },
    {
      id: 13,
      suit: 'Climat',
      name: 'Fumée',
      strength: 27,
      bonus: null,
      penalty: 'Cette carte est MASQUÉE sauf avec au moins une <span class="flame">Flamme</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Flamme');
      },
      relatedSuits: ['Flamme'],
      relatedCards: []
    },
    {
      id: 14,
      suit: 'Climat',
      name: 'Tornade',
      strength: 13,
      bonus: '+40 avec l\'<span class="weather">Orage</span> et soit le <span class="weather">Blizzard</span>, soit l\'<span class="flood">Inondation</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Orage') && (hand.contains('Blizzard') || hand.contains('Inondation')) ? 40 : 0;
      },
      relatedSuits: ['Orage'],
      relatedCards: ['Blizzard', 'Inondation']
    },
    {
      id: 15,
      suit: 'Climat',
      name: 'Élémental d\'Air',
      strength: 4,
      bonus: '+15 pour chaque autre <span class="weather">Climat</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Climat', this.id);
      },
      relatedSuits: ['Climat'],
      relatedCards: []
    },
    {
      id: 16,
      suit: 'Flamme',
      name: 'Feu de Forêt',
      strength: 40,
      bonus: null,
      penalty: 'MASQUE toutes les cartes sauf les <span class="flame">Flammes</span>, les <span class="wizard">Sorciers</span>, les <span class="weather">Climats</span>, les <span class="weapon">Armes</span>, les <span class="artifact">Artéfacts</span>, la <span class="land">Montagne</span>, l\'<span class="flood">Inondation</span>, l\'<span class="flood">Île</span>, la <span class="beast">Licorne</span> et le <span class="beast">Dragon</span>.',
      blanks: function(card, hand) {
        return !(card.suit === 'Flamme' || card.suit === 'Sorcier' || card.suit === 'Climat' ||
          card.suit === 'Arme' || card.suit === 'Artéfact' || card.suit === 'Joker' || card.name === 'Montagne' ||
          card.name === 'Inondation' || card.name === 'Île' || card.name === 'Licorne' || card.name === 'Dragon');
      },
      relatedSuits: allSuits(),
      relatedCards: ['Montagne', 'Inondation', 'Île', 'Licorne', 'Dragon']
    },
    {
      id: 17,
      suit: 'Flamme',
      name: 'Chandelle',
      strength: 2,
      bonus: '+100 avec le <span class="artifact">Livre des Mutations</span>, le <span class="land">Beffroi</span> et n\'importe quel <span class="wizard">Sorcier</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Livre des Mutations') && hand.contains('Beffroi') && hand.containsSuit('Sorcier') ? 100 : 0;
      },
      relatedSuits: ['Sorcier'],
      relatedCards: ['Livre des Mutations', 'Beffroi']
    },
    {
      id: 18,
      suit: 'Flamme',
      name: 'Forge',
      strength: 9,
      bonus: '+9 pour chaque <span class="weapon">Arme</span> et chaque <span class="artifact">Artéfact</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * (hand.countSuit('Arme') + hand.countSuit('Artéfact'));
      },
      relatedSuits: ['Arme', 'Artéfact'],
      relatedCards: []
    },
    {
      id: 19,
      suit: 'Flamme',
      name: 'Éclair',
      strength: 11,
      bonus: '+30 avec l\'<span class="weather">Orage</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Orage') ? 30 : 0;
      },
      relatedSuits: [],
      relatedCards: ['Orage']
    },
    {
      id: 20,
      suit: 'Flamme',
      name: 'Élémental de Feu',
      strength: 4,
      bonus: '+15 pour chaque autre <span class="flame">Flamme</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Flamme', this.id);
      },
      relatedSuits: ['Flamme'],
      relatedCards: []
    },
    {
      id: 21,
      suit: 'Armée',
      name: 'Chevaliers',
      strength: 20,
      bonus: null,
      penalty: '-8 sauf avec au moins un <span class="leader">Seigneur</span>.',
      penaltyScore: function(hand) {
        return hand.containsSuit('Seigneur') ? 0 : -8;
      },
      relatedSuits: ['Seigneur'],
      relatedCards: []
    },
    {
      id: 22,
      suit: 'Armée',
      name: 'Archers Elfes',
      strength: 10,
      bonus: '+5 si vous n\'avez pas de <span class="weather">Climat</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Climat') ? 0 : 5;
      },
      relatedSuits: ['Climat'],
      relatedCards: []
    },
    {
      id: 23,
      suit: 'Armée',
      name: 'Cavalerie Légère',
      strength: 17,
      bonus: null,
      penalty: '-2 pour chaque <span class="land">Terrain</span>.',
      penaltyScore: function(hand) {
        return -2 * hand.countSuit('Terrain');
      },
      relatedSuits: ['Terrain'],
      relatedCards: []

    },
    {
      id: 24,
      suit: 'Armée',
      name: 'Infanterie Naine',
      strength: 15,
      bonus: null,
      penalty: '-2 pour chaque autre <span class="army">Armée</span>.',
      penaltyScore: function(hand) {
        if (!hand.containsId(25)) { // clears the word 'Armée' from the penalty
          return -2 * hand.countSuitExcluding('Armée', this.id);
        }
        return 0;
      },
      relatedSuits: ['Armée'],
      relatedCards: []
    },
    {
      id: 25,
      suit: 'Armée',
      name: 'Éclaireurs',
      strength: 5,
      bonus: '+10 pour chaque <span class="land">Terrain</span>. <br />EFFACE le mot <span class="army">Armée</span> de tous les malus.',
      penalty: null,
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Terrain');
      },
      relatedSuits: ['Terrain', 'Armée'],
      relatedCards: []
    },
    {
      id: 26,
      suit: 'Sorcier',
      name: 'Collectionneur',
      strength: 7,
      bonus: '+10 si vous avez trois cartes différentes de la même famille, +40 si vous avez quatre cartes différentes de la même famille, +100 si vous avez cinq cartes différentes de la même famille.',
      penalty: null,
      bonusScore: function(hand) {
        var bySuit = {};
        for (const card of hand.nonBlankedCards()) {
          var suit = card.suit;
          if (bySuit[suit] === undefined) {
            bySuit[suit] = {};
          }
          bySuit[suit][card.name] = card;
        }
        var bonus = 0;
        for (const suit of Object.values(bySuit)) {
          var count = Object.keys(suit).length;
          if (count === 3) {
            bonus += 10;
          } else if (count === 4) {
            bonus += 40;
          } else if (count >= 5) {
            bonus += 100;
          }
        }
        return bonus;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 27,
      suit: 'Sorcier',
      name: 'Dresseur',
      strength: 9,
      bonus: '+9 pour chaque <span class="beast">Créature</span>. <br />EFFACE les malus de toutes les <span class="beast">Créatures</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * hand.countSuit('Créature');
      },
      clearsPenalty: function(card) {
        return card.suit === 'Créature';
      },
      relatedSuits: ['Créature'],
      relatedCards: []
    },
    {
      id: 28,
      suit: 'Sorcier',
      name: 'Nécromancien',
      strength: 3,
      bonus: 'À la fin de la partie, vous pouvez prendre une <span class="army">Armée</span>, un <span class="leader">Seigneur</span>, un <span class="wizard">Sorcier</span>, ou une <span class="beast">Créature</span> de la défausse et l\'ajouter à votre main comme huitième carte.',
      penalty: null,
      relatedSuits: ['Armée', 'Seigneur', 'Sorcier', 'Créature'],
      relatedCards: []
    },
    {
      id: 29,
      suit: 'Sorcier',
      name: 'Démoniste',
      strength: 25,
      bonus: null,
      penalty: '-10 pour chaque <span class="leader">Seigneur</span> et chaque autre <span class="wizard">Sorcier</span>.',
      penaltyScore: function(hand) {
        return -10 * (hand.countSuit('Seigneur') + hand.countSuitExcluding('Sorcier', this.id));
      },
      relatedSuits: ['Seigneur', 'Sorcier'],
      relatedCards: []
    },
    {
      id: 30,
      suit: 'Sorcier',
      name: 'Enchanteresse',
      strength: 5,
      bonus: '+5 pour chaque <span class="land">Terrain</span>, <span class="weather">Climat</span>, <span class="flood">Vague</span> et <span class="flame">Flamme</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 5 * (hand.countSuit('Terrain') + hand.countSuit('Climat') + hand.countSuit('Vague') + hand.countSuit('Flamme'));
      },
      relatedSuits: ['Terrain', 'Climat', 'Vague', 'Flamme'],
      relatedCards: []
    },
    {
      id: 31,
      suit: 'Seigneur',
      name: 'Roi',
      strength: 8,
      bonus: '+5 pour chaque <span class="army">Armée</span>. <br />OU Avec la <span class="leader">Reine</span>, +20 pour chaque <span class="army">Armée</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains('Reine') ? 20 : 5) * hand.countSuit('Armée');
      },
      relatedSuits: ['Armée'],
      relatedCards: ['Reine']
    },
    {
      id: 32,
      suit: 'Seigneur',
      name: 'Reine',
      strength: 6,
      bonus: '+5 pour chaque <span class="army">Armée</span>. <br />OU Avec le <span class="leader">Roi</span> +20 pour chaque <span class="army">Armée</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains('Roi') ? 20 : 5) * hand.countSuit('Armée');
      },
      relatedSuits: ['Armée'],
      relatedCards: ['Roi']
    },
    {
      id: 33,
      suit: 'Seigneur',
      name: 'Princesse',
      strength: 2,
      bonus: '+8 pour chaque <span class="army">Armée</span>, <span class="wizard">Sorcier</span>, et chaque autre <span class="leader">Seigneur</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 8 * (hand.countSuit('Armée') + hand.countSuit('Sorcier') + hand.countSuitExcluding('Seigneur', this.id));
      },
      relatedSuits: ['Armée', 'Sorcier', 'Seigneur'],
      relatedCards: []
    },
    {
      id: 34,
      suit: 'Seigneur',
      name: 'Chef de Guerre',
      strength: 4,
      bonus: 'La somme de toutes les forces de base de toutes les <span class="army">Armées</span>.',
      penalty: null,
      bonusScore: function(hand) {
        var total = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.suit === 'Armée') {
            total += card.strength;
          }
        }
        return total;
      },
      relatedSuits: ['Armée'],
      relatedCards: []
    },
    {
      id: 35,
      suit: 'Seigneur',
      name: 'Impératrice',
      strength: 15,
      bonus: '+10 pour chaque <span class="army">Armée</span>.',
      penalty: '-5 pour chaque autre <span class="leader">Seigneur</span>.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Armée');
      },
      penaltyScore: function(hand) {
        return -5 * hand.countSuitExcluding('Seigneur', this.id);
      },
      relatedSuits: ['Armée', 'Seigneur'],
      relatedCards: []
    },
    {
      id: 36,
      suit: 'Créature',
      name: 'Licorne',
      strength: 9,
      bonus: '+30 avec la <span class="leader">Princesse</span>. <br />OU +15 avec l\'<span class="leader">Impératrice</span>, la <span class="leader">Reine</span>, ou l\'<span class="leader">Enchanteresse</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Princesse') ? 30 : (hand.contains('Impératrice') || hand.contains('Reine') || hand.contains('Enchanteresse')) ? 15 : 0;
      },
      relatedSuits: [],
      relatedCards: ['Princesse', 'Impératrice', 'Reine', 'Enchanteresse']
    },
    {
      id: 37,
      suit: 'Créature',
      name: 'Basilik',
      strength: 35,
      bonus: null,
      penalty: 'MASQUE toutes les <span class="leader">Seigneurs</span>, <span class="army">Armées</span>, et les autres <span class="beast">Créatures</span>.',
      blanks: function(card, hand) {
        return (card.suit === 'Armée' && !hand.containsId(25)) || // clears the word 'Armée' from the penalty
          card.suit === 'Seigneur' ||
          (card.suit === 'Créature' && card.id !== this.id);
      },
      relatedSuits: ['Armée', 'Seigneur', 'Créature'],
      relatedCards: []
    },
    {
      id: 38,
      suit: 'Créature',
      name: 'Cheval de Guerre',
      strength: 6,
      bonus: '+14 avec n\'importe quel <span class="leader">Seigneur</span> ou <span class="wizard">Sorcier</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Seigneur') || hand.containsSuit('Sorcier') ? 14 : 0;
      },
      relatedSuits: ['Seigneur', 'Sorcier'],
      relatedCards: []
    },
    {
      id: 39,
      suit: 'Créature',
      name: 'Dragon',
      strength: 30,
      bonus: null,
      penalty: '-40 sauf avec au moins un <span class="wizard">Sorcier</span>.',
      penaltyScore: function(hand) {
        return hand.containsSuit('Sorcier') ? 0 : -40;
      },
      relatedSuits: ['Sorcier'],
      relatedCards: []
    },
    {
      id: 40,
      suit: 'Créature',
      name: 'Hydre',
      strength: 12,
      bonus: '+28 avec le <span class="flood">Marécage</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Marécage') ? 28 : 0;
      },
      relatedSuits: [],
      relatedCards: ['Marécage']
    },
    {
      id: 41,
      suit: 'Arme',
      name: 'Navire de Guerre',
      strength: 23,
      bonus: 'EFFACE le mot <span class="army">Armée</span> des malus de toutes les <span class="flood">Vagues</span>.',
      penalty: 'MASQUÉE sauf avec au moins une <span class="flood">Vague</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Vague');
      },
      relatedSuits: ['Armée', 'Vague'],
      relatedCards: []
    },
    {
      id: 42,
      suit: 'Arme',
      name: 'Baguette Magique',
      strength: 1,
      bonus: '+25 avec n\'importe quel <span class="wizard">Sorcier</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Sorcier') ? 25 : 0;
      },
      relatedSuits: ['Sorcier'],
      relatedCards: []
    },
    {
      id: 43,
      suit: 'Arme',
      name: 'Épée de Keth',
      strength: 7,
      bonus: '+10 avec n\'importe quel <span class="leader">Seigneur</span>. <br />OU +40 avec un <span class="leader">Seigneur</span> et le <span class="artifact">Bouclier de Keth</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Seigneur') ? (hand.contains('Bouclier de Keth') ? 40 : 10) : 0;
      },
      relatedSuits: ['Seigneur'],
      relatedCards: ['Bouclier de Keth']
    },
    {
      id: 44,
      suit: 'Arme',
      name: 'Arc Elfique',
      strength: 3,
      bonus: '+30 avec les <span class="army">Archers Elfes</span>, le <span class="leader">Chef de Guerre</span> ou le <span class="wizard">Dresseur</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Archers Elfes') || hand.contains('Chef de Guerre') || hand.contains('Dresseur') ? 30 : 0;
      },
      relatedSuits: [],
      relatedCards: ['Archers Elfes', 'Chef de Guerre', 'Dresseur']
    },
    {
      id: 45,
      suit: 'Arme',
      name: 'Dirigeable',
      strength: 35,
      bonus: null,
      penalty: 'MASQUÉE sauf avec au moins une <span class="army">Armée</span>. <br />MASQUÉE avec n\'importe quel <span class="weather">Climat</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Armée') || hand.containsSuit('Climat');
      },
      relatedSuits: ['Armée', 'Climat'],
      relatedCards: []
    },
    {
      id: 46,
      suit: 'Artéfact',
      name: 'Bouclier de Keth',
      strength: 4,
      bonus: '+15 avec n\'importe quel <span class="leader">Seigneur</span>. <br />OU +40 avec un <span class="leader">Seigneur</span> et l\'<span class="weapon">Épée Keth</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Seigneur') ? (hand.contains('Épée de Keth') ? 40 : 15) : 0;
      },
      relatedSuits: ['Seigneur'],
      relatedCards: ['Épée de Keth']
    },
    {
      id: 47,
      suit: 'Artéfact',
      name: 'Gemme de Loi',
      strength: 5,
      bonus: '+10 pour une suite 3 cartes, +30 pour une suite 4 cartes, +60 pour une suite 5 cartes, +100 pour une suite 6 cartes, +150 pour une suite 7 cartes. <br />(En référence à la force de base des cartes.)',
      penalty: null,
      bonusScore: function(hand) {
        var strengths = hand.nonBlankedCards().map(card => card.strength);
        var currentRun = 0;
        var runs = [];
        for (var i = 0; i <= 40; i++) {
          if (strengths.includes(i)) {
            currentRun++;
          } else {
            runs.push(currentRun);
            currentRun = 0;
          }
        }
        var bonus = 0;
        for (var run of runs) {
          if (run === 3) {
            bonus += 10;
          } else if (run === 4) {
            bonus += 30;
          } else if (run === 5) {
            bonus += 60;
          } else if (run === 6) {
            bonus += 100;
          } else if (run >= 7) {
            bonus += 150;
          }
        }
        return bonus;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 48,
      suit: 'Artéfact',
      name: 'Arbre-Monde',
      strength: 2,
      bonus: '+50 si toutes les cartes non-MASQUÉES appartiennent à des familles différentes.',
      penalty: null,
      bonusScore: function(hand) {
        var suits = [];
        for (const card of hand.nonBlankedCards()) {
          if (suits.includes(card.suit)) {
            return 0;
          }
          suits.push(card.suit);
        }
        return 50;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 49,
      suit: 'Artéfact',
      name: 'Livre des Mutations',
      strength: 3,
      bonus: 'Vous pouvez changer la famille d\'une autre carte. Son nom, ainsi que ses bonus et malus restent les mêmes.',
      penalty: null,
      action: 'Choisissez une famille et une carte de votre main.',
      relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Livre des Mutations'
      relatedCards: []
    },
    {
      id: 50,
      suit: 'Artéfact',
      name: 'Rune de Protection',
      strength: 1,
      bonus: 'EFFACE le malus de toutes les cartes.',
      penalty: null,
      clearsPenalty: function(card) {
        return true;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 51,
      suit: 'Joker',
      name: 'Métamorphe',
      strength: 0,
      bonus: 'Peut copier le nom et la famille de n\'importe quel <span class="artifact">Artéfact</span>, <span class="leader">Seigneur</span>, <span class="wizard">Sorcier</span>, <span class="weapon">Armée</span> ou <span class="beast">Créature</span> du jeu. <br />N\'appliquez ni le bonus, ni le malus, ni la force de base de la carte copiée.',
      penalty: null,
      action: 'Choisissez une carte du jeu à copier.',
      relatedSuits: ['Artéfact', 'Seigneur', 'Sorcier', 'Arme', 'Créature'].sort(),
      relatedCards: []
    },
    {
      id: 52,
      suit: 'Joker',
      name: 'Mirage',
      strength: 0,
      bonus: 'Peut copier le nom et la famille de n\'importe quel <span class="land">Terrain</span>, <span class="army">Armée</span>, <span class="weather">Climat</span>, <span class="flood">Vague</span> ou <span class="flame">Flamme</span> du jeu. <br />N\'appliquez ni le bonus, ni le malus, ni la force de base de la carte copiée.',
      penalty: null,
      action: 'Choisissez une carte du jeu à copier.',
      relatedSuits: ['Armée', 'Terrain', 'Climat', 'Vague', 'Flamme'].sort(),
      relatedCards: []
    },
    {
      id: 53,
      suit: 'Joker',
      name: 'Doppelgänger',
      strength: 0,
      bonus: 'Peut copier le nom, la force de base, la famille et le malus MAIS PAS LE BONUS de n\'importe quelle autre carte de votre main.',
      penalty: null,
      action: 'Choisissez une carte de votre main à copier.',
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 54,
      suit: 'Sorcier',
      name: 'Jester',
      strength: 3,
      bonus: '+3 pour chaque autre carte avec une force de base impaire. <br />OU +50 si toutes les cartes non-MASQUÉES de votre main ont une force de base impaire.',
      penalty: null,
      bonusScore: function(hand) {
        var oddCount = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.strength % 2 === 1) {
            oddCount++;
          }
        }
        if (oddCount === hand.size()) {
          return 50;
        } else {
          return (oddCount - 1) * 3;
        }
      },
      relatedSuits: [],
      relatedCards: []
    }
  ],
  getCardByName: function(cardName) {
    for (const card of this.cards) {
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function(id) {
    return this.cards[id - 1];
  },
  getCardsBySuit: function(suits) {
    var cardsBySuit = {};
    for (const card of this.cards) {
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    Object.keys(cardsBySuit).sort().forEach(function(key) {
      ordered[key] = cardsBySuit[key];
    });
    return ordered;
  }
};

function allSuits() {
  return ['Terrain', 'Vague', 'Climat', 'Flamme', 'Armée', 'Sorcier', 'Seigneur', 'Créature', 'Arme', 'Artéfact', 'Joker'].sort();
}

var NONE = -1;
var ISLAND = 9;
var NECROMANCER = 28;
var BOOK_OF_CHANGES = 49;
var SHAPESHIFTER = 51;
var MIRAGE = 52;
var DOPPELGANGER = 53;

var ACTION_ORDER = [DOPPELGANGER, MIRAGE, SHAPESHIFTER, BOOK_OF_CHANGES, ISLAND];
