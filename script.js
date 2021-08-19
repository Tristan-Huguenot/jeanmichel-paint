/*      Initialisation variables OBJETS     */

var canvas = document.getElementById('canvas')  // Recuperation du canvas puis adaptation taille
canvas.width = 1000
canvas.height = 600
var canvasContexte = canvas.getContext('2d')    // Recuperation contexte pour pouvoir "dessiner" dessus. 2d pour que le canvas soit gerer comme une surface en 2D

var dlButton = document.getElementById('dl')

        //OUTILS
var caseChoixPlein = document.getElementById('choixPlein')
var tailleOutil = {
    'taille': document.getElementById('tailleOutil'),
    'texte': document.getElementById('affichageTaille'),
}

var couleur = {
    'couleurChoisi' : document.getElementById('couleur'),
    'couleurTexte' : document.getElementById('couleurTexte')
}
/*      Fin variables OBJETS        */

/*      Initialisation variables    */

let isPlein = false
let isDrawing = false

let couleurSelectionner = couleur.couleurChoisi.value
couleur.couleurTexte.value = couleurSelectionner
caseChoixPlein.style.border = `1px solid ${couleurSelectionner}`
caseChoixPlein.style.width = `${tailleOutil.taille.value*2}px`
caseChoixPlein.style.height = `${tailleOutil.taille.value*2}px`

tailleOutil.texte.textContent = `${tailleOutil.taille.value}`

/*      Fin variables   */

/*  Fonctions outils    */

function verificationTaille(){
    if(tailleOutil.taille.value >= 1 && tailleOutil.taille.value <= 100){
        return true
    }
    return false
}
function choixTaille(){
    if(tailleOutil.taille.value < 1){
        return 1
    }
    return 100
}

function getXandYEvent(event){
    clickX = event.offsetX
    clickY = event.offsetY
}

function inversePleinCreux(){
    if(!(caseChoixPlein.style.backgroundColor)){
        caseChoixPlein.style.backgroundColor = couleurSelectionner;
        isPlein = true
    }
    else{
        caseChoixPlein.style.backgroundColor = '';
        isPlein = false
    }
}
function modificationTaille(){
    tailleOutil.taille.value = (verificationTaille()) ? tailleOutil.taille.value : choixTaille();
    tailleOutil.texte.textContent = `${tailleOutil.taille.value}`
    caseChoixPlein.style.width = `${tailleOutil.taille.value*2}px`
    caseChoixPlein.style.height = `${tailleOutil.taille.value*2}px`
}
function modificationCouleurSelection(){
    couleurSelectionner = couleur.couleurChoisi.value
    couleur.couleurTexte.value = couleurSelectionner
    caseChoixPlein.style.backgroundColor = (isPlein) ? `${couleurSelectionner}` : `#fff`
    caseChoixPlein.style.border = `1px solid ${couleurSelectionner}`
}
function modificationCouleurHexa(){
    couleurSelectionner = couleur.couleurTexte.value
    couleur.couleurChoisi.value = couleurSelectionner
    caseChoixPlein.style.backgroundColor = (isPlein) ? `${couleurSelectionner}` : `#fff`
    caseChoixPlein.style.border = `1px solid ${couleurSelectionner}`
}
function telechargerAsPng(){
    let dataUrl = canvas.toDataURL("image/png", 1.0)
    let a = document.createElement('a')
    a.href = dataUrl
    a.download = 'canvas.jpeg'
    document.body.appendChild(a)
    a.style.display = "none"
    a.click()
}
/*  Fonctions de dessin     */

function dessinerPixel(x, y, couleur){       // 1.Dessine un pixel (un rectangle de longueur 1 et de largeur 1)
    canvasContexte.fillStyle = couleur
    canvasContexte.fillRect(x,y,1,1)
}
function dessinerCercle(rayon, cercleX, cercleY, plein, couleur){        // 1.Algorithme de tracé de cercle de Bresenham
    if(rayon == 1){ 
        return (dessinerPixel(cercleX,cercleY, couleur)) 
    }
    else{
        rayon--
    }
    let x = 0
    let y = rayon
    let m = 5 - 4 * rayon
    
    if(!(plein)){// 1.La condition va gerer si le cercle est plein ou creux
        while(x <= y){  // 1.2Ici on ne trace que le contour                
            dessinerPixel(-y+cercleX, -x+cercleY, couleur)
            dessinerPixel(y+cercleX, -x+cercleY, couleur)
            dessinerPixel(-x+cercleX, -y+cercleY, couleur) 
            dessinerPixel(x+cercleX, -y+cercleY, couleur)
            dessinerPixel(-x+cercleX, y+cercleY, couleur)
            dessinerPixel(x+cercleX, y+cercleY, couleur)
            dessinerPixel(-y+cercleX, x+cercleY, couleur)
            dessinerPixel(y+cercleX, x+cercleY, couleur)
        
            if(m > 0){
             y -= 1
                m = m - 8*y
            }
            x += 1
            m = m + 8*x + 4
        }
    }
    else{
        while(x <= y){

            for (i = x; i >= 0; i--){                   // 1.1Pour chaque les 8 octant avec les 4 valeurs possibles de Y (se referer à dessinerPixel(x, y))
                dessinerPixel(-y+cercleX, x-i+cercleY, couleur)  // 1.2on dessine les ligne verticales interieur.
                dessinerPixel(y+cercleX, x-i+cercleY, couleur)
            }
            for (i = y; i >= 0; i--){
                dessinerPixel(-x+cercleX, y-i+cercleY, couleur)
                dessinerPixel(x+cercleX, y-i+cercleY, couleur)
            }
            for (i = y; i >= 0; i--){
               dessinerPixel(-x+cercleX, -y+i+cercleY, couleur) 
               dessinerPixel(x+cercleX, -y+i+cercleY, couleur)
            }
            for (i = x; i >= 0; i--){
                dessinerPixel(-y+cercleX, -x+i+cercleY, couleur)
                dessinerPixel(y+cercleX, -x+i+cercleY, couleur)
            }
        
        
            if(m > 0){
                y -= 1
                m = m - 8*y
            }
            x += 1
            m = m + 8*x + 4
        }
    }
}
/*  Fin function dessin     */

/* EVENEMENTS */

//  Evenements dessin

    canvas.addEventListener('mousedown', function(event){   // 1.Quand le clique est enfoncé il dessine une premiere fois la forme choisi
        
        getXandYEvent(event)
    
        dessinerCercle(tailleOutil.taille.value, clickX, clickY, isPlein, couleurSelectionner)
        isDrawing = true;                                   // 2.puis specifie que nous sommes en train de dessiner
    })

    canvas.addEventListener('mouseup', function(){          // 1. Quand le click se s'arrete ( se releve ) nous ne sommes plus en train de dessiner
        isDrawing = false;
    })

    canvas.addEventListener('mousemove', function(event){ // 1. A chaque fois que la souris bouge

        getXandYEvent(event) 

        if(isDrawing){                                      // 3.Seulement si l'on dessine (voir 'mousedown' )

            dessinerCercle(tailleOutil.taille.value, clickX, clickY, isPlein, couleurSelectionner)  // 4.Et apelle la fonction de dessinerCercle(rayon, cercleX, cercleY, plein)
    
        }
    })

//

//  Evenement outils

    caseChoixPlein.addEventListener('click', function (){   // Change la valeur de isPlein pour decider si dessinerCercle est plein ou creux
        inversePleinCreux()
    })   


    tailleOutil.taille.addEventListener('input', function (){  // Choix de la taille
        modificationTaille()
    })       

    couleur.couleurChoisi.addEventListener('input', function(){     // Choix de la couleur avec Selecteur
        modificationCouleurSelection()
    })
    couleur.couleurTexte.addEventListener('focusout', function(){     // Choix de la couleur avec Hexa
    
        modificationCouleurHexa()
    })
    couleur.couleurTexte.addEventListener('keypress', function(event){
        if (event.code == 'Enter'){
            modificationCouleurHexa()
        }
    })

    dlButton.addEventListener('click', function(){          // Pour telecharger
        telechargerAsPng()
    })
//