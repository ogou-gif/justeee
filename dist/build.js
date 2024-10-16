const fs = require('fs');
const path = require('path');

// Chemins des fichiers source et destination
const sourceDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'dist');

function copyFiles(src, dest) {
    fs.readdir(src, (err, files) => {
        if (err) {
            console.error('Erreur de lecture du répertoire :', err);
            return;
        }

        files.forEach(file => {
            const srcFile = path.join(src, file);
            const destFile = path.join(dest, file);

            fs.stat(srcFile, (err, stat) => {
                if (err) {
                    console.error('Erreur de stat :', err);
                    return;
                }

                if (stat.isDirectory()) {
                    // Si c'est un dossier, créer le dossier de destination et copier les fichiers à l'intérieur
                    fs.mkdir(destFile, { recursive: true }, (err) => {
                        if (err) {
                            console.error(`Erreur lors de la création du dossier ${destFile} :`, err);
                        } else {
                            copyFiles(srcFile, destFile);
                        }
                    });
                } else {
                    // Si c'est un fichier, le copier
                    fs.copyFile(srcFile, destFile, (err) => {
                        if (err) {
                            console.error(`Erreur lors de la copie de ${file} :`, err);
                        } else {
                            console.log(`Copié ${file} dans dist`);
                        }
                    });
                }
            });
        });
    });
}

// Création du répertoire de destination s'il n'existe pas
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
}

// Lancer la copie
copyFiles(sourceDir, destDir);
