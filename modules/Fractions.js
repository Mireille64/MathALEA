import { fraction_simplifiee,calcul,tex_fraction_signe,arrondi,unSiPositifMoinsUnSinon } from "/modules/outils.js"

export function obtenir_liste_Fractions_irreductibles() { //sous forme de fractions
	return  [fraction(1,2),fraction(1,3),fraction(2,3),fraction(1,4),fraction(3,4),fraction(1,5),fraction(2,5),fraction(3,5),fraction(4,5),
	fraction(1,6),fraction(5,6),fraction(1,7),fraction(2,7),fraction(3,7),fraction(4,7),fraction(5,7),fraction(6,7),fraction(1,8),fraction(3,8),fraction(5,8),fraction(7,8),
	fraction(1,9),fraction(2,9),fraction(4,9),fraction(5,9),fraction(7,9),fraction(8,9),fraction(1,10),fraction(3,10),fraction(7,10),fraction(9,10)]
}
export function obtenir_liste_Fractions_irreductibles_faciles() { //sous forme de fractions
	return  [fraction(1,2),fraction(1,3),fraction(2,3),fraction(1,5),fraction(2,5),fraction(3,5),fraction(4,5),
	fraction(1,7),fraction(2,7),fraction(3,7),fraction(4,7),fraction(5,7),fraction(6,7)]
}

/**
 * @class ListeFraction
 * @classdesc Classe Fraction - Méthodes utiles sur les collections de fractions
 * @author Sébastien Lozano
 */

export function ListeFraction() {
    //'use strict'; pas de use strict avec un paramètre du reste
    /**
     * @constant {array} denominateurs_amis tableau de tableaux de dénominateurs qui vont bien ensemble pour les calculs
     * le tableau [12,2,3,4,6] faisait planter 4C25-0
     */
    //let denominateurs_amis = [[12,2,3,4,6],[16,2,4,8],[18,2,3,6,9],[20,2,4,5,10],[24,2,3,4,8,12],[30,2,3,5,6],[32,2,16,4,8],[36,2,18,4,9],[40,2,20,4,10,5,8]]
    let denominateurs_amis = [[16,2,4,8],[18,2,3,6,9],[20,2,4,5,10],[24,2,3,4,8,12],[30,2,3,5,6],[32,2,16,4,8],[36,2,18,4,9],[40,2,20,4,10,5,8]]

   /**
    * 
    * @param  {...any} fractions contient la liste des numérateurs et denominateurs dans l'ordre n1,d1,n2,d2, ... de deux ou plus de fractions
    * @return {array} renvoie un tableau avec les numérateurs et les dénominateurs triés selon la croissance des quotients [n_frac_min,d_frac_min,...,n_frac_max,d_frac_max]
    * @example sortFraction(1,2,1,5,1,4,1,3) renvoie [1,5,1,4,1,3,1,2] 
    */
   function sortFractions(...fractions) {
       try {		
           fractions.forEach(function(element) {
               if (typeof element != 'number') {
                   throw new TypeError(`${element} n'est pas un nombre !`);
               };
               if ( (fractions.indexOf(element)%2 == 1) && (element == 0)) {
                   throw new RangeError(`${element} est exclu des valeurs possibles pour les dénominateurs !`)
               };
           });	
           if (Math.floor(fractions.length/2) <= 1 ) {
               throw new Error(`Il faut au moins deux fractions !`);
           };
           if (fractions.length%2 != 0) {
               throw new Error(`Il faut un nombre pair de valeurs puisque q'une fraction est représentée par son numérateur et son dénominateur`);
           };
           let changed;
           do{
                changed = false;
                for (let i=0; i<(fractions.length-1); i+=2) {
                   if ((fractions[i]/fractions[i+1]) > (fractions[i+2]/fractions[i+3])) {
                       let tmp = [fractions[i],fractions[i+1]];
                       fractions[i]=fractions[i+2];
                       fractions[i+1] = fractions[i+3];
                       fractions[i+2] = tmp [0];
                       fractions[i+3] = tmp[1];
                       changed = true;
                   };
                };
           } while(changed);
           return fractions;
       }
       catch (e) {
           console.log(e.message);
       };
   };

   /**
    * fonction locale pour trouver le ppcm d'un nombre indeterminé d'entiers
    * @param  {integer} n parametre du reste contenant une liste d'entiers
    * * la liste d'entiers doit être passé dans un tableau
    * @return {number} renvoie le ppcm des nombres entiers passés dans le paramètre du reste n
    * @example ppcm(2,6,4,15) renvoie 60
    */
   function ppcm([...n]) {
       try {
            n.forEach(function(element) {
               if (typeof element != 'number') {
                   throw new TypeError(`${element} n'est pas un nombre !`);
               };
           });
           // Quoi faire sans nombres ?
           if (n.length == 0) {
               throw new Error(`C'est mieux avec quelques nombres !`)
           };
           return parseInt(Algebrite.run(`lcm(${n})`));

       }
       catch (e) {
           console.log(e.message);
       };
   };

   /**
    * 
    * @param  {...any} fractions contient la liste des numérateurs et des dénominateurs dans l'ordre n1,d1,n2,d2, ... de deux ou plus de fractions
    * @return {array} renvoie un tableau de numérateurs et de dénominateurs avec le même dénominateur dans l'ordre initial.
    * * Le dénominateur choisi est toujours le ppcm
    * * Les fractions ne sont pas réduites
    * @example reduceSameDenominateur(1,2,1,5,2,3) renvoie [15,30,6,30,20,30]
    */
    function reduceSameDenominateur(...fractions) {
       try {		
        fractions.forEach(function(element) {
               if (typeof element != 'number') {
                   throw new TypeError(`${element} n'est pas un nombre !`);
               };
               if ( (fractions.indexOf(element)%2 == 1) && (element == 0)) {
                   throw new RangeError(`${element} est exclu des valeurs possibles pour les dénominateurs !`)
               };
           });	
           if (Math.floor(fractions.length/2) <= 1 ) {
               throw new Error(`Il faut au moins deux fractions !`);
           };
           if (fractions.length%2 != 0) {
               throw new Error(`Il faut un nombre pair de valeurs puisque q'une fraction est représentée par son numérateur et son dénominateur`);
           };
           let denominateur_commun;
           let liste_denominateurs = [];
           for (let i=0; i<fractions.length-1; i+=2) {
               liste_denominateurs.push(fractions[i+1]);
           };
           denominateur_commun = ppcm(liste_denominateurs);
           let fractions_reduites = [];
           for (let i=0; i<fractions.length-1; i+=2) {
               //on calcule le nouveau numérateur
               fractions_reduites.push(fractions[i]*denominateur_commun/fractions[i+1]);
               fractions_reduites.push(denominateur_commun);
           };

           //return [fractions,'-',liste_denominateurs,'-',denominateur_commun,'-',fractions_reduites];
           return fractions_reduites;

       }
       catch (e) {
           console.log(e.message);
       };
   };

   this.sortFractions = sortFractions;
   this.reduceSameDenominateur = reduceSameDenominateur;
   this.denominateurs_amis = denominateurs_amis;
   this.fraction_simplifiee = fraction_simplifiee;
};

/**
 * @constructor Construit un objet Fraction(a,b)
 * @param {integer} a 
 * @param {integer} b 
 */
export function fraction (a,b) {
   return new Fraction(a,b)
}

/**
* @class
* @classdesc Méthodes utiles sur les fractions
* @param {number} num numérateur
* @param {number} den dénominateur
* @author Jean-Claude Lhote et Sébastien Lozano
*/

function Fraction(num,den) {
   /**
    * @property {integer} numérateur optionnel, par défaut la valeur vaut 0
    */
   this.num = num || 0;
   /**
    * @property {integer} dénominateur optionnel, par défaut la valeur vaut 1
    */
   this.den=den || 1;
   /**
    * numIrred est le numérateur réduit
    * denIrredest le dénominateur réduit
    */
   this.numIrred=fraction_simplifiee(this.num,this.den)[0]
   this.denIrred=fraction_simplifiee(this.num,this.den)[1]
   this.pourcentage=calcul(this.numIrred*100/this.denIrred)
   if (this.num==0) this.signe=0
   else this.signe=unSiPositifMoinsUnSinon(this.num*this.den) // le signe de la fraction : -1, 0 ou 1
   this.texFraction = tex_fraction_signe(this.num,this.den)
    this.texFractionSimplifiee = tex_fraction_signe(this.numIrred,this.denIrred)
   this.valeurDecimale=arrondi(this.num/this.den,6)
   
   /**
    * @return {object} La fraction "complexifiée" d'un rapport k
    * @param {number} k Le nombre par lequel, le numérateur et le dénominateur sont multipliés.
    */
    this.fractionEgale = function(k){
       return fraction(calcul(this.num*k),calcul(this.den*k))
   }   
    this.simplifie=function() {
       return fraction(this.numIrred,this.denIrred)
   }
   /**
    * @return {object} L'opposé de la fraction
    */
    this.oppose = function(){
       return fraction(-this.num,this.den)
   }
   /**
    * @return {object]} L'opposé de la fracion réduite
    */
    this.opposeIrred = function(){
       return fraction(-this.numIrred,this.denIrred)
   }
   /**
    * @return {object]} L'inverse de la fraction
    */
    this.inverse = function(){
       return fraction(this.den,this.num)
   }
   /**
    * @return {object} L'inverse de la fraction simplifiée
    */
    this.inverseIrrred = function(){
       return fraction(this.denIrred,this.numIrred)
   }
   /**
    * @return {object} La somme des fractions
    * @param {object} f2 La fraction qui s'ajoute
    */
    this.sommeFraction =function(f2) {
       return fraction(this.num*f2.den+f2.num*this.den,this.den*f2.den)
   }
   /**
    * @return {object} La somme de toutes les fractions
    * @param  {...any} fractions Liste des fractions à ajouter à la fraction
    */
    this.sommeFractions = function(...fractions){
       let s=fraction(this.num,this.den)
       for (let f of fractions) {
           s=s.sommeFraction(f)
       }
       return s
   }
   /**
    * @return {object} Le produit des deux fractions
    * @param {object} f2  LA fraction par laquelle est multipliée la fraction
    */
    this.produitFraction = function(f2) {

       return fraction(this.num*f2.num,this.den*f2.den)
   }
   /**
    * @return {string} Le calcul du produit de deux fractions avec étape intermédiaire
    *  @params {object} f2 la fraction qui multiplie. 
    */
    this.texProduitFraction = function(f2) {
           return `${this.texFraction}\\times ${f2.texFraction}=${tex_fraction(this.num+`\\times`+f2.num,this.den+`\\times`+f2.den)}=${tex_fraction(this.num*f2.num,this.den*f2.den)}`
   } 

   /**
    * @return {object} La puissance n de la fraction
    * @param {integer} n l'exposant de la fraction 
    */
    this.puissanceFraction = function(n) {
       return fraction(this.num**n,this.den**n)
   }
   /**
    * @param  {...any} fractions Les fractions qui multiplient la fraction
    * @return Le produit des fractions
    */
    this.produitFractions = function(...fractions){
       let p=fraction(this.num,this.den)
       for (let f of fractions) {
           p=p.produitFraction(f)
   }
       return p
   }
   /**
    * @param {object} f2 est la fracion qui est soustraite de la fraction
    * @return {objet} La différence des deux fractions
    */
    this.differenceFraction = function(f2) {
       return this.sommeFraction(f2.oppose())
   }
   this.diviseFraction = function(f2){
       return this.produitFraction(f2.inverse())
   }
   this.texQuotientFraction = function(f2) {
       return `${this.texFraction}\\div ${f2.texFraction}=${this.texFraction}\\times ${f2.inverse().texFraction}=${tex_fraction(this.num+`\\times`+f2.den,this.den+`\\times`+f2.num)}=${tex_fraction(this.num*f2.den,this.den*f2.num)}`
   }

/**
* @return {object}  Renvoie une fraction avec comme dénominateur une puissance de 10 ou 'NaN' si la fraction n'a pas de valeur décimale
*/
    this.fractionDecimale = function(){
       let den=this.denIrred
       let liste=obtenir_liste_facteurs_premiers(den)
       let n2=0,n5=0
       for (let n of liste) {
           if (n==2) n2++
           else if (n==5) n5++
           else return 'NaN'
       }
       if (n5==n2) return fraction(this.numIrred,this.fractionDecimale.denIrred)
       else if (n5>n2) return fraction(this.numIrred*2**(n5-n2),this.denIrred*2**(n5-n2))
       else return fraction(this.numIrred*5**(n2-n5),this.denIrred*5**(n2-n5))
   }
   
   /**
    * @return {string} Code Latex de la fraction
    */
   /**
    * 
    * @param {integer} n entier par lequel multiplier la fraction 
    * @return {object} fraction multipliée par n
    */
    this.multiplieEntier = function(n) {
       return fraction(n*this.num,this.den);
   };

       /**
    * 
    * @param {integer} n entier par lequel multiplier la fraction 
    * @return {object} fraction multipliée par n simplifiée
    */
    this.multiplieEntierIrred = function(n) {
       return fraction(n*this.num,this.den).simplifie();
   };
   /**
    * @return fraction divisée par n
    * @param {integer} n entier qui divise la fraction 
    */
    this.entierDivise=function(n){
       return fraction(this.num,n*this.den)
   }
       /**
    * @return fraction divisée par n et réduite si possible
    * @param {integer} n entier qui divise la fraction 
    */
   this.entierDiviseIrred=function(n){
       return fraction(this.num,n*this.den).simplifie()
   }
       /**
    * @return n divisé par fraction
    * @param {integer} n entier divisé par la fraction 
    */
   this.diviseEntier=function(n){
       return fraction(n*this.den,this.num)
   }
   this.diviseEntierIrred=function(n){
       return fraction(n*this.den,this.num).simplifie()
   }

   /**
    * @return {object} la fraction augmentée de n
    * @param {integer} n entier à ajouter à la fraction 
    */
    this.ajouteEntier=function(n){
       return fraction(this.num+this.den*n,this.den)
   }
/**
* @return {object} n moins la fraction
* @param {integer} n l'entier duqel on soustrait la fraction 
*/
    this.entierMoinsFraction=function(n){
       return (fraction(n*this.den-this.num,this.den))
   }
   /**
    * 
    * @param {number} depart N° de la première part coloriée (0 correspond à la droite du centre) 
    * @param {*} type 'gateau' ou 'segment' ou 'barre'
    * @Auteur Jean-Claude Lhote
    */
    this.representationIrred = function (x, y, rayon, depart = 0, type = 'gateau', couleur = 'gray',unite0=0,unite1=1,scale=1,label="") {
       let objets = [], n, num, k, dep, s, a, O, C
       n = quotientier(this.numIrred, this.denIrred)
       num = this.numIrred
       let unegraduation=function(x,y,couleur='black',epaisseur=1){
           let A=point(x,y+0.2)
           let B=point(x,y-0.2)
           let g=segment(A,B)
           g.color=couleur
           g.epaisseur=epaisseur
           return g
       }
       if (type == 'gateau') {
           for (k = 0; k < n; k++) {
               O = point(x + k * 2 * (rayon + 0.5), y)
               C = cercle(O, rayon)
               objets.push(C)
               for (let i = 0; i < this.denIrred; i++) {
                   s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O,90- i * 360 / this.denIrred))
                   objets.push(s)
               }
               dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O,90- depart * 360 / this.denIrred)
               for (let j = 0; j < Math.min(this.denIrred, num); j++) {
                   a = arc(dep, O, -360 / this.denIrred, true, fill = couleur)
                   a.opacite = 0.3
                   dep = rotation(dep, O, -360 / this.denIrred)
                   objets.push(a)
               }
               num -= this.denIrred
           }
           if (this.num%this.den!=0) { 
               O = point(x + k * 2 * (rayon + 0.5), y)
               C = cercle(O, rayon)
               objets.push(C)
               for (let i = 0; i < this.denIrred; i++) {
                   s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90-i * 360 / this.denIrred))
                   objets.push(s)
               }
               dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O,90- depart * 360 / this.denIrred)
               for (let j = 0; j < Math.min(this.denIrred, num); j++) {
                   a = arc(dep, O, -360 / this.denIrred, true, fill = couleur)
                   a.opacite = 0.3
                   dep = rotation(dep, O, -360 / this.denIrred)
                   objets.push(a)
               }
           }
       }
       else if (type == 'segment') {
           for (k = 0; k < n; k++) {
               O = point(x + k *rayon, y)
               C = translation(O, vecteur(rayon, 0))
               s = segment(O, C)
               s.styleExtremites = '-|'
               objets.push(s)
               for (let i = 0; i < this.denIrred; i++) {
                   s = segment(translation(O, vecteur(i * rayon / this.denIrred, 0)), translation(O, vecteur((i + 1) * rayon / this.denIrred, 0)))
                   s.styleExtremites = '|-'
                   objets.push(s)
               }
               a = segment(O, point(O.x + Math.min(num, this.denIrred) * rayon / this.denIrred, O.y))
               a.color = couleur
               a.opacite = 0.4
               a.epaisseur = 6
               objets.push(a)
               num -= this.denIrred
           }
           O = point(x + k * rayon, y)
           C = translation(O, vecteur(rayon, 0))
           s = segment(O, C)
           s.styleExtremites = '-|'
           objets.push(s)
           for (let i = 0; i < this.denIrred; i++) {
               s = segment(translation(O, vecteur(i * rayon / this.denIrred, 0)), translation(O, vecteur((i + 1) * rayon / this.denIrred, 0)))
               s.styleExtremites = '|-'
               objets.push(s)
           }
           a = segment(O, point(O.x + Math.min(this.numIrred, this.denIrred) * rayon / this.denIrred, O.y))
           a.color = couleur
           a.opacite = 0.4
           a.epaisseur = 6
           objets.push(a)
           objets.push(unegraduation(x,y))
           if (typeof(unite0)=='number'&&typeof(unite1)=='number') {
               for (k=0;k<=n+1;k++) {
                   objets.push(texteParPosition(unite0+k*(unite1-unite0),x+rayon*k,y-0.6,'milieu','black',scale))
               }
           }
           else {
           if (unite0!="") objets.push(texteParPosition(unite0,x,y-0.6,'milieu','black',scale))
           if (unite1!="") objets.push(texteParPosition(unite1,x+rayon,y-0.6,'milieu','black',scale))
           if (label!="") objets.push(texteParPosition(label,x+rayon*this.numIrred/this.denIrred,y-0.6,'milieu','black',scale))
           }

       }
       else {
           let diviseur
           if (this.denIrred % 6 == 0) diviseur=6
           else if (this.denIrred % 5 == 0) diviseur=5
           else if (this.denIrred % 4 == 0) diviseur=4
           else if (this.denIrred % 3 == 0) diviseur=3
           else if (this.denIrred % 2 == 0) diviseur=2
           else diviseur = 1

           for (k = 0; k < n; k++) {
               for (let j = 0; j < diviseur; j++) {
                   for (let h = 0; h < calcul(this.denIrred / diviseur); h++) {
                       O = point(x + k * (rayon + 1)+j*rayon/diviseur, y + h * rayon / diviseur)
                       C = translation(O, vecteur(rayon / diviseur, 0))
                       dep = carre(O, C)
                       dep.color = 'black'
                       dep.couleurDeRemplissage = couleur
                       dep.opaciteDeRemplissage=0.4
                       objets.push(dep)
                   }
               }
               num -= this.den
           }
           if (num>0) {
               for (let j = 0; j < diviseur; j++) {
                   for (let h = 0; h < calcul(this.denIrred / diviseur); h++) {
                       O = point(x + k * (rayon + 1)+j*rayon/diviseur, y + h * rayon / diviseur)
                       C = translation(O, vecteur(rayon / diviseur, 0))
                       dep = carre(O, C)
                       dep.color = 'black'
                       objets.push(dep)
                   }
               }
               for (let i = 0; i < num; i++) {
               O = point(x + k * (rayon + 1) + (i % diviseur) * rayon / diviseur, y + quotientier(i, diviseur) * rayon / diviseur)
               C = translation(O, vecteur(rayon / diviseur, 0))
               dep = carre(O, C)
               dep.color = 'black'
               dep.couleurDeRemplissage = couleur
               dep.opaciteDeRemplissage=0.4
               objets.push(dep)
           }
       }
       }
       return objets
   }
   /**
    * 
    * Représente une fraction sous forme de disque (gateau), de segment ou de rectangle
    * le type peut être : 'gateau', 'segment' ou 'barre'
    * l'argument départ sert pour la représentation disque à fixer l'azimut du premier secteur : 0 correspond à 12h.
    * les arguments unite0 et unite1 servent pour la représentation 'segment'. On peut ainsi choisir les délimiteurs de l'unité, ce sont habituellement 0 et 1, à ce moment la, chaque entier est affiché sous sa graduation.
    * Si ce sont des variable de type string, il n'y a que ces deux étiquettes qui sont écrites.
    */
    this.representation = function (x, y, rayon, depart = 0, type = 'gateau', couleur = 'gray',unite0=0,unite1=1,scale=1,label="") {
       let objets = [], n, num, k, dep, s, a, O, C
       n = quotientier(this.num, this.den)
       num = this.num
        let unegraduation=function(x,y,couleur='black',epaisseur=1){
           let A=point(x,y+0.2)
           let B=point(x,y-0.2)
           let g=segment(A,B)
           g.color=couleur
           g.epaisseur=epaisseur
           return g
       }
       if (type == 'gateau') {
           for (k = 0; k < n; k++) {
               let O = point(x + k * 2 * (rayon + 0.5), y)
               let C = cercle(O, rayon)
               objets.push(C)
               let s, a
               for (let i = 0; i < this.den; i++) {
                   s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90-i * 360 / this.den))
                   objets.push(s)
               }
               dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90-depart * 360 / this.den)
               for (let j = 0; j < Math.min(this.den, num); j++) {
                   a = arc(dep, O,- 360 / this.den, true,couleur)
                   a.opacite = 0.3
                   dep = rotation(dep, O, -360 / this.den)
                   objets.push(a)
               }
               num -= this.den
           }
           if (this.num%this.den!=0) { $
               let O = point(x + k * 2 * (rayon + 0.5), y)
               let C = cercle(O, rayon)
               objets.push(C)
               for (let i = 0; i < this.den; i++) {
                   s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90-i * 360 / this.den))
                   objets.push(s)
               }
           
               dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O,90- depart * 360 / this.den)
               if (this.num%this.den!=0) for (let j = 0; j < Math.min(this.den, num); j++) {
                   a = arc(dep, O, -360 / this.den, true, couleur)
                   a.opacite = 0.3
                   dep = rotation(dep, O, -360 / this.den)
                   objets.push(a)
               }
           }
       }
       else if (type == 'segment') {
           for (k = 0; k < n; k++) {
               O = point(x + k * rayon, y)
               C = translation(O, vecteur(rayon, 0))
               s = segment(O, C)
               s.styleExtremites = '-|'
               objets.push(s)
               for (let i = 0; i < this.den; i++) {
                   s = segment(translation(O, vecteur(i * rayon / this.den, 0)), translation(O, vecteur((i + 1) * rayon / this.den, 0)))
                   s.styleExtremites = '|-'
                   objets.push(s)
               }
               a = segment(O, point(O.x + Math.min(num, this.den) * rayon / this.den, O.y))
               a.color = couleur
               a.opacite = 0.4
               a.epaisseur = 6
               objets.push(a)
               num -= this.den
           }
           O = point(x + k * rayon , y)
           C = translation(O, vecteur(rayon, 0))
           s = segment(O, C)
           s.styleExtremites = '-|'
           objets.push(s)
           for (let i = 0; i < this.den; i++) {
               s = segment(translation(O, vecteur(i * rayon / this.den, 0)), translation(O, vecteur((i + 1) * rayon / this.den, 0)))
               s.styleExtremites = '|-'
               objets.push(s)
           }
           a = segment(O, point(O.x + Math.min(num, this.den) * rayon / this.den, O.y))
           a.color = couleur
           a.opacite = 0.4
           a.epaisseur = 6
           objets.push(a)
           objets.push(unegraduation(x,y))
           if (typeof(unite0)=='number'&&typeof(unite1)=='number') {
               for (k=0;k<=n+1;k++) {
                   objets.push(texteParPosition(unite0+k*(unite1-unite0),x+rayon*k,y-0.6,'milieu','black',scale))
               }
           }
           else {
           if (unite0!="") objets.push(texteParPosition(unite0,x,y-0.6,'milieu','black',scale))
           if (unite1!="") objets.push(texteParPosition(unite1,x+rayon,y-0.6,'milieu','black',scale))
           if (label!="") objets.push(texteParPosition(label,x+rayon*this.num/this.den,y-0.6,'milieu','black',scale))
           }
       }
       else { //Type barre
           let diviseur
           if (this.den % 6 == 0) diviseur=6
           else if (this.den % 5 == 0) diviseur=5
           else if (this.den % 4 == 0) diviseur=4
           else if (this.den % 3 == 0) diviseur=3
           else if (this.den % 2 == 0) diviseur=2
           else diviseur = 1

           for (k = 0; k < n; k++) {
               for (let j = 0; j < diviseur; j++) {
                   for (let h = 0; h < calcul(this.den / diviseur); h++) {
                       O = point(x + k * (rayon + 1)+j*rayon/diviseur, y + h * rayon / diviseur)
                       C = translation(O, vecteur(rayon / diviseur, 0))
                       dep = carre(O, C)
                       dep.color = 'black'
                       dep.couleurDeRemplissage = couleur
                       dep.opaciteDeRemplissage=0.4
                       objets.push(dep)
                   }
               }
               num -= this.den
           }
           if (num>0) {
               for (let j = 0; j < diviseur; j++) {
                   for (let h = 0; h < calcul(this.den / diviseur); h++) {
                       O = point(x + k * (rayon + 1)+j*rayon/diviseur, y + h * rayon / diviseur)
                       C = translation(O, vecteur(rayon / diviseur, 0))
                       dep = carre(O, C)
                       dep.color = 'black'
                       objets.push(dep)
                   }
               }
               for (let i = 0; i < num; i++) {
               O = point(x + k * (rayon + 1) + (i % diviseur) * rayon / diviseur, y + quotientier(i, diviseur) * rayon / diviseur)
               C = translation(O, vecteur(rayon / diviseur, 0))
               dep = carre(O, C)
               dep.color = 'black'
               dep.couleurDeRemplissage = couleur
               dep.opaciteDeRemplissage=0.4
               objets.push(dep)
           }
       }
       }
       return objets
   }


}