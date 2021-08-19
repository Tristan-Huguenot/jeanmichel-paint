/*      Initialisation variables OBJETS     */

var canvas = document.getElementById('canvas')  // Recuperation du canvas puis adaptation taille
canvas.width = 1000
canvas.height = 600
var canvasContexte = canvas.getContext('2d')    // Recuperation contexte pour pouvoir "dessiner" dessus. 2d pour que le canvas soit gerer comme une surface en 2D
canvasContexte.fillStyle = "#fff"                       // On applique un fond blanc pour le telechargement (sinon fond noir)
canvasContexte.fillRect(0,0,canvas.width,canvas.height)

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
let isDrawing = false;

let couleurSelectionner = couleur.couleurChoisi.value
couleur.couleurTexte.textContent = couleurSelectionner
caseChoixPlein.style.border = `1px solid ${couleurSelectionner}`

let taille = Number(tailleOutil.taille.value)
tailleOutil.texte.textContent = 'Taille = ' + taille

/*      Fin variables   */

/*  Fonctions de dessin     */

function dessinerPixel(x, y){       // 1.Dessine un pixel (un rectangle de longueur 1 et de largeur 1)
    canvasContexte.fillStyle = couleurSelectionner
    canvasContexte.fillRect(x,y,1,1)
}
function dessinerCercle(rayon, cercleX, cercleY, plein){        // 1.Algorithme de tracé de cercle de Bresenham
    let x = 0
    let y = rayon
    let m = 5 - 4 * rayon
    while(x <= y){

        // 1.La condition va gerer si le cercle est plein ou creux

        if (plein){
            for (i = x; i >= 0; i--){                   // 1.1Pour chaque les 8 octant avec les 4 valeurs possibles de Y (se referer à dessinerPixel(x, y))
                dessinerPixel(-y+cercleX, x-i+cercleY)  // 1.2on dessine les ligne verticales interieur.
                dessinerPixel(y+cercleX, x-i+cercleY)
            }
            for (i = y; i >= 0; i--){
                dessinerPixel(-x+cercleX, y-i+cercleY)
                dessinerPixel(x+cercleX, y-i+cercleY)
            }
            for (i = y; i >= 0; i--){
               dessinerPixel(-x+cercleX, -y+i+cercleY) 
               dessinerPixel(x+cercleX, -y+i+cercleY)
            }
            for (i = x; i >= 0; i--){
                dessinerPixel(-y+cercleX, -x+i+cercleY)
                dessinerPixel(y+cercleX, -x+i+cercleY)
            }
        }
        else{                                           // 1.2Ici on ne trace que le contour
            dessinerPixel(-y+cercleX, -x+cercleY)
            dessinerPixel(y+cercleX, -x+cercleY)
            dessinerPixel(-x+cercleX, -y+cercleY) 
            dessinerPixel(x+cercleX, -y+cercleY)
            dessinerPixel(-x+cercleX, y+cercleY)
            dessinerPixel(x+cercleX, y+cercleY)
            dessinerPixel(-y+cercleX, x+cercleY)
            dessinerPixel(y+cercleX, x+cercleY)
        }
        if(m > 0){
            y -= 1
            m = m - 8*y
        }
        x += 1
        m = m + 8*x + 4
    }
}

/*  Fin function dessin     */

//

    canvas.addEventListener('touchmove', function(event){   // 1. A chaque fois que la souris bouge 
        if(isDrawing){                                      // 2.Seulement si l'on dessine (voir 'mousedown' )

            let clickX = event.offsetX          //3.Garde en memoire la ou est la souris quand l'evenement est déclancher
            let clickY = event.offsetY
    
            dessinerCercle(taille, clickX, clickY, isPlein)  // 4.Et apelle la fonction de dessinerCercle(rayon, cercleX, cercleY, plein)
    
        }
    })
    canvas.addEventListener('touchstart', function(event){   // 1.Quand le clique est enfoncé il dessine une premiere fois la forme choisi
        let clickX = event.offsetX
        let clickY = event.offsetY
    
        dessinerCercle(taille, clickX, clickY, isPlein)
        isDrawing = true;                                   // 2.puis specifie que nous sommes en train de dessiner
    })

    canvas.addEventListener('touchend', function(){          // 1. Quand le click se s'arrete ( se releve ) nous ne sommes plus en train de dessiner
        isDrawing = false;
    })


    canvas.addEventListener('mousedown', function(event){   // 1.Quand le clique est enfoncé il dessine une premiere fois la forme choisi
        let clickX = event.offsetX
        let clickY = event.offsetY
    
        dessinerCercle(taille, clickX, clickY, isPlein)
        isDrawing = true;                                   // 2.puis specifie que nous sommes en train de dessiner
    })

    canvas.addEventListener('mouseup', function(){          // 1. Quand le click se s'arrete ( se releve ) nous ne sommes plus en train de dessiner
        isDrawing = false;
    })

    canvas.addEventListener('mousemove', function(event){   // 1. A chaque fois que la souris bouge 
        if(isDrawing){                                      // 2.Seulement si l'on dessine (voir 'mousedown' )

            let clickX = event.offsetX          //3.Garde en memoire la ou est la souris quand l'evenement est déclancher
            let clickY = event.offsetY
    
            dessinerCercle(taille, clickX, clickY, isPlein)  // 4.Et apelle la fonction de dessinerCercle(rayon, cercleX, cercleY, plein)
    
        }
    })



//

//
caseChoixPlein.addEventListener('click', function(){    // Change la valeur de isPlein pour decider si dessinerCercle est plein ou creux
    if(!(caseChoixPlein.style.backgroundColor)){
        caseChoixPlein.style.backgroundColor = couleurSelectionner;
        isPlein = true
    }
    else{
        caseChoixPlein.style.backgroundColor = '';
        isPlein = false
    }
})

tailleOutil.taille.addEventListener('input', function (){
    taille = Number(tailleOutil.taille.value)
    tailleOutil.texte.textContent = 'Taille = ' + taille
})

couleur.couleurChoisi.addEventListener('input', function(){
    couleurSelectionner = couleur.couleurChoisi.value
    couleur.couleurTexte.textContent = couleurSelectionner
    caseChoixPlein.style.backgroundColor = (isPlein) ? `${couleurSelectionner}` : `#fff`
    caseChoixPlein.style.border = `1px solid ${couleurSelectionner}`
})

dlButton.addEventListener('click', function(){
    let dataUrl = canvas.toDataURL("image/jpeg", 1.0)
    let a = document.createElement('a')
    a.href = dataUrl
    a.download = 'canvas.jpeg'
    document.body.appendChild(a)
    a.style.display = "none"
    a.click()
})