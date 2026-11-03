<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ManejadorProyectoModel
 *
 * @author jose
 */
class ManejadorProyectoModel extends ZendExt_Model
{

    //put your code here
    private $_dirWorkspace;
    private $_dirRepositorio;
    private $_document;
    private $_dirPathApps;


    function ManejadorProyectoModel(DOMDocument $document)
    {
        parent::ZendExt_Model();
        $this->_document = $document;
        $this->_dirWorkspace = dirname(__FILE__) . '/../../../../web/zeolhelp/workspaces/';
        $this->_dirRepositorio = dirname(__FILE__) . '/../../../../web/zeolhelp/repositorio/';
        $this->filenamexml = dirname(__FILE__) . '/../../../comun/recursos/xml/aplicaciones.xml';
        $this->_dirPathApps = dirname(__FILE__) . '/../../../../web/';
    }

    public function listarProjecto()
    {
        $itemsPack = array_diff(
            scandir($this->_dirWorkspace),
            array('.', '..', '.svn')
        );
        $tmp = array();
        foreach ($itemsPack as $value) {
            if (is_dir($this->_dirWorkspace . $value)) {
                $nombre = str_replace(" ", "", $value);
                $tmp['workspaces'][] = array(
                    'nombre' => $value,
                    'li' => $this->getLi(
                        $this->_dirWorkspace . $value . '/index.html'
                    )
                );
            }
        }
        if (!OFF_LINE) {
            $subSistemas = $this->integrator->seguridad->obtenerDatosSubsistemas();
            foreach ($subSistemas as $value) {
                $dirhelp = $this->_dirPathApps . (string)$value['uri'] . '/help/';
                if (is_dir($dirhelp)) {
                    $nombre = str_replace(
                        " ",
                        "",
                        (string)$value['denominacion']
                    );
                    $tmp['framework'][] = array(
                        'nombre' => (string)$value['denominacion'],
                        'uri' => (string)$value['uri'],
                        "li" => $this->getLi(
                            $dirhelp . 'index.html',
                            true
                        )
                    );
                }
            }
        }

        return $tmp;
    }

    private function getLi($dirindex, $style = false)
    {
        $manejador = new ManejadorEstructura();
        $this->_document->loadHTMLFile($dirindex);
        $ul = $this->_document->getElementById("menu-indice");
        $li = $manejador->getElement($ul->childNodes, 'li');
        // $li = $this->_document->getElementById($idli);
        $lichildList = $li->childNodes;
        foreach ($lichildList as $child) {
            if ($child->nodeName == 'ul') {
                $li->removeChild($child);
            }
        }
        $attrliStyle = $this->_document->createAttribute('style');
        $attrliStyle->nodeValue = "cursor: pointer;";
        $span = $this->_document->createElement('span');
        $attrSpan = $this->_document->createAttribute('class');
        $attrSpan->nodeValue = "glyphicon glyphicon-book";
        $attrSpanStyle = $this->_document->createAttribute('style');
        $attrSpanStyle->nodeValue = "padding-right: 4px;";
        $span->appendChild($attrSpanStyle);
        $span->appendChild($attrSpan);
        $a = $manejador->getElement($li->childNodes, 'a');
        if ($style) {
            $attrA = $this->_document->createAttribute('style');
            $attrA->nodeValue = "color: #1c8b5b;";
            $a->appendChild($attrA);
        }
        $a->insertBefore($span, $a->firstChild);
        $li->appendChild($attrliStyle);

        return $this->_document->saveHTML($li);
    }

    public function cargarProjecto($name, $idNodo, $type = 'workspaces', $uri = false)
    {
        $name = trim($name);
        $html = "";
        switch ($type) {
            case 'workspaces':
                $dirArchivo = $this->_dirWorkspace . $name . "/index.html";
                if (file_exists($dirArchivo)) {
                    $this->_document->loadHTMLFile($dirArchivo);
                    //$name = str_replace(" ", "", $name);
                    $div = $this->_document->getElementById($idNodo);
                    $html = $this->_document->saveHTML($div);
                }
                break;
            case 'framework':
                $dirArchivo = $this->_dirPathApps . $uri . '/help/index.html';
                if (file_exists($dirArchivo)) {
                    $this->_document->loadHTMLFile($dirArchivo);
                    //$name = str_replace(" ", "", $name);
                    $div = $this->_document->getElementById($idNodo);
                    $html = $this->_document->saveHTML($div);
                }
                break;
        }

        return $html;
    }

    public function exportarProyecto($name, $type = 'workspaces', $uri = false)
    {
        /* limppiar el repositorio */
        $this->remove('*', $this->_dirRepositorio);
        $name = ($type == 'workspaces') ? $name : 'help';
        $lacation = $_SERVER['HTTP_HOST'] . '/zeolhelp/repositorio/' . str_replace(' ', '_', $name);
        /* realizar copia del proyecto que se quiere exportar */
        switch ($type) {
            case 'workspaces':
                $this->copyPaste(
                    $name,
                    $this->_dirWorkspace,
                    $this->_dirRepositorio
                );
                break;
            case 'framework':
                $this->copyPaste(
                    $name,
                    $this->_dirPathApps . $uri . '/',
                    $this->_dirRepositorio
                );
                break;
        }
        /*Crear Json encriptado*/
        $manejador = new ManejadorEstructura();
        $manejador->exportSumVerify($this->_dirRepositorio, $name);
        /* comprimir el proyecto */
        shell_exec(
            'cd ' . $this->_dirRepositorio . '; zip -r ' . str_replace(' ', '_', $name) . '.zip ' .
            str_replace(' ', '\ ', $name)
        );
        /* eliminar proyecto */
        $this->remove($name, $this->_dirRepositorio);

        return $lacation . '.zip';
    }

    static public function modificarreferencia(
        $contenido,
        $etiqueta,
        $attribute,
        $nameProject,
        $action,
        $uri
    )
    {
        $domdocument = new DOMDocument();
        $domdocument->loadHTML(
            mb_convert_encoding($contenido, 'HTML-ENTITIES', 'UTF-8')
        );
        $source = $domdocument->getElementsByTagName($etiqueta);
        $length = $source->length;
        for ($i = 0; $i < $length; $i++) {
            $elemento = $source->item($i);
            $src = $elemento->getAttribute($attribute);
            if ($src) {
                $tmp = explode('/', $src);
                if ($tmp[0] != 'http:' && $tmp[0] != 'https:' && $tmp[0] != 'ftp:'
                ) {
                    $cadena = rawurldecode($nameProject);
                    switch ($action) {
                        case 'guardar':
                            if ($uri == 'workspaces') {
                                $newsrc = str_replace(
                                    'workspaces/' . $cadena . '/',
                                    "",
                                    rawurldecode($src)
                                );
                            } else {
                                if ($uri == 'zeolhelp') {
                                    $arr = explode('/', rawurldecode($src), 2);
                                    $newsrc = $arr[1];
                                } else {
                                    $newsrc = str_replace(
                                        '../' . $uri . '/help/',
                                        '',
                                        rawurldecode($src)
                                    );
                                }
                            }
                            break;
                        case 'contenido':
                            if ($uri == 'workspaces') {
                                $newsrc = 'workspaces/' . $cadena . '/' . rawurldecode($src);
                            } else {
                                if ($uri == 'zeolhelp') {
                                    $newsrc = 'help/' . rawurldecode($src);
                                } else {
                                    $newsrc = '../' . $uri . '/help/' . rawurldecode($src);
                                }
                            }
                            break;
                    }
                    $elemento->setAttribute($attribute, $newsrc);
                }
            }
        }

        return $domdocument->saveHTML();
    }

    public function nuevoProyecto(
        $newProject,
        $type = 'workspaces',
        $uri = false
    )
    {
        $newName = ($type == 'workspaces') ? $this->_dirWorkspace : $this->_dirPathApps . $uri . '/help/';
        switch ($type) {
            case 'workspaces':
                if (!is_dir($newName . $newProject)) {
                    if (mkdir($newName . $newProject, 0777)) {
                        $dirPlantilla =
                            dirname(__FILE__) . '/../../../../web/zeolhelp/' . 'resources/plantillas/ayuda.json';
                        $contenido = file_get_contents($dirPlantilla);
                        $plantilla = json_decode($contenido, true);
                        $newName .= str_replace(" ", "\\ ", $newProject);
                        $manejador = new ManejadorEstructura();
                        $manejador->createEstructura(
                            $newName,
                            $plantilla
                        );
                        $this->addNombreProyecto($newProject);

                        return array(
                            "success" => true,
                            "codMsg" => 1,
                            "mensaje" => "El proyecto ha sido adicionado satisfactoriamente."
                        );
                    } else {
                        return array(
                            "succes" => false,
                            "codMsg" => 6,
                            "mensaje" => "Ocurrio un probrema en el servidor. Contacte al administrador."
                        );
                    }
                } else {
                    return array(
                        "succes" => false,
                        "codMsg" => 6,
                        "mensaje" => "El proyecto que quieres adicionar ya existe."
                    );
                }
            case 'framework':
                if (!is_dir($newName)) {
                    mkdir($newName, 0777);
                    $dirPlantilla = dirname(__FILE__) . '/../../../../web/zeolhelp/resources/plantillas/ayuda.json';
                    $contenido = file_get_contents($dirPlantilla);
                    $plantilla = json_decode($contenido, true);
                    $manejador = new ManejadorEstructura();
                    $manejador->createEstructura($newName, $plantilla, true);
                    $this->addNombreProyecto($newProject, $type, $uri);
                    $msg = "El proyecto ha sido adicionado
                            satisfactoriamente.";

                    return array(
                        "success" => true,
                        "codMsg" => 1,
                        "mensaje" => $msg
                    );
                } else {
                    return array(
                        "success" => false,
                        "codMsg" => 6,
                        "mensaje" => "Ya existe un proyecto en el subsistema."
                    );
                }
        }
    }

    public function importarProyecto()
    {
        $targetPath = $this->_dirRepositorio;
        $targetPath = $targetPath . $_FILES['file']['name'];
        $name = $_FILES['file']['name'];
        $tmp = explode('.', $name);
        $length = count($tmp);
        /*Eliminar todo lo del repositorio*/
        shell_exec('rm -R ' . $this->_dirRepositorio . '*');
        $result = null;
        if ($tmp[$length - 1] == 'zip') {
            if (is_dir(dirname($targetPath))) {
                if (move_uploaded_file(
                    $_FILES['file']['tmp_name'],
                    $targetPath
                )) {
                    $zip = new ZipArchive();
                    if ($zip->open($targetPath) === true) {
                        $manejador = new ManejadorEstructura();
                        $arrays = explode(
                            '/',
                            $zip->getNameIndex($zip->numFiles - 1)
                        );
                        $nameOne = $arrays[0];
                        shell_exec(
                            'cd ' . $this->_dirRepositorio . '; unzip ' . $name . " -d " .
                            $this->_dirRepositorio
                        );
//                        rename(
//                            $this->_dirRepositorio . $name,
//                            $this->_dirRepositorio . $nameOne . '.zip'
//                        );
                        //$zip->extractTo($this->_dirRepositorio);
                        $zip->close();
                        if ($manejador->importSumVerify(
                            $this->_dirRepositorio,
                            $nameOne
                        )
                        ) {
                            $dirHtml = $this->_dirRepositorio . $nameOne . '/index.html';
                            $this->_document->loadHTMLFile($dirHtml);
                            $ul = $this->_document->getElementById(
                                'menu-indice'
                            );
                            if ($ul) {
                                $li = $ul->getElementsByTagName('li')
                                    ->item(0);
                                if ($li) {
                                    $a = $li->getElementsByTagName('a')
                                        ->item(
                                            0
                                        );
                                    if ($a) {
                                        $uri = $a->getAttribute('uri');
                                        /* $nombre = $this->integrator->seguridad->obtenerSubsistemaUri(
                                             $uri
                                         );
                                         /*$nombre = ($uri == 'workspaces')
                                             ? $nameOne
                                             : str_replace(
                                                 ' ',
                                                 '',
                                                 $nombre
                                             );*/
                                        try {
                                            if ($manejador->validateHtmlMenu($dirHtml)) {
                                                $dirCopy = ($uri == 'workspaces') ? $this->_dirWorkspace :
                                                    $this->_dirPathApps . $uri . '/';
                                                if (is_dir($dirCopy)) {
                                                    if (!is_dir(
                                                        $dirCopy . $nameOne
                                                    )
                                                    ) {
                                                        $this->copyPaste(
                                                            $nameOne,
                                                            $this->_dirRepositorio,
                                                            $dirCopy
                                                        );
                                                        $msg = 'El projecto ha ' . 'sido importado ' .
                                                            'satisfactorimente.';
                                                        $result = array(
                                                            "succes" => true,
                                                            "codMsg" => 1,
                                                            "mensaje" => $msg
                                                        );
                                                    } else {
                                                        $msg = 'El proyecto que ' . 'quiere importar ya existe.';
                                                        $this->remove(
                                                            $nameOne,
                                                            $this->_dirRepositorio
                                                        );
                                                        $result = array(
                                                            "succes" => false,
                                                            "codMsg" => 6,
                                                            "mensaje" => $msg
                                                        );
                                                    }
                                                } else {
                                                    $this->remove(
                                                        $nameOne,
                                                        $this->_dirRepositorio
                                                    );
                                                    $mensaje = ($uri == "workspaces")
                                                        ? "No existe un espacio" . " de trabajo disponible." :
                                                        "El subsistema '$uri' " . "no fue encontrado";
                                                    $result = array(
                                                        "succes" => false,
                                                        "codMsg" => 6,
                                                        "mensaje" => $mensaje
                                                    );
                                                }
                                            } else {
                                                $this->remove(
                                                    $nameOne,
                                                    $this->_dirRepositorio
                                                );
                                                $msg = "El proyecto $name no ha sido importado debido a que" .
                                                    " se ha modificado indebidamente.";
                                                $result = array(
                                                    "succes" => false,
                                                    "codMsg" => 6,
                                                    "mensaje" => $msg
                                                );
                                            }
                                        } catch (Exception $ex) {
                                            $this->remove(
                                                $nameOne,
                                                $this->_dirRepositorio
                                            );
                                            $result = array(
                                                "succes" => false,
                                                "codMsg" => 6,
                                                "mensaje" => $ex->getMessage()
                                            );
                                        }
                                    } else {
                                        $this->remove(
                                            $nameOne,
                                            $this->_dirRepositorio
                                        );
                                        $msg = "El proyecto $name no ha sido importado debido a que" .
                                            " se ha modificado indebidamente.";
                                        $result = array(
                                            "succes" => false,
                                            "codMsg" => 6,
                                            "mensaje" => $msg
                                        );
                                    }
                                } else {
                                    $this->remove(
                                        $nameOne,
                                        $this->_dirRepositorio
                                    );
                                    $msg = "El proyecto $name no ha sido importado debido a que" .
                                        " se ha modificado indebidamente.";
                                    $result = array(
                                        "succes" => false,
                                        "codMsg" => 6,
                                        "mensaje" => $msg
                                    );
                                }
                            } else {
                                $this->remove($nameOne, $this->_dirRepositorio);
                                $msg = "El proyecto $name no ha sido importado debido a que" .
                                    " se ha modificado indebidamente.";
                                $result = array(
                                    "succes" => false,
                                    "codMsg" => 6,
                                    "mensaje" => $msg
                                );
                            }
                        } else {
                            $this->remove($name, $this->_dirRepositorio);
                            $result = array(
                                "succes" => false,
                                "codMsg" => 6,
                                "mensaje" => "La suma de verificación " . "no coincide."
                            );
                        }
                    } else {
                        // $this->remove($nameOne, $this->_dirRepositorio);
                        $this->remove($name, $this->_dirRepositorio);
                        $msg = "El proyecto $name no ha sido importado debido a que se ha modificado indebidamente.";
                        $result = array(
                            "succes" => false,
                            "codMsg" => 6,
                            "mensaje" => $msg
                        );
                    }
                } else {
                    $result = array(
                        "succes" => false,
                        "codMsg" => 6,
                        "mensaje" => 'Ocurrio un error al subir el proyecto.'
                    );
                }
            } else {
                $result = array(
                    "succes" => false,
                    "codMsg" => 6,
                    "mensaje" => 'Ocurrio un error al subir el proyecto.'
                );
            }
        } else {
            $msg = "El proyecto $name no ha sido importado debido a que se ha modificado indebidamente.";
            $result = array(
                "succes" => false,
                "codMsg" => 6,
                "mensaje" => $msg
            );
        }

        return $result;
    }

    public function deleteProject($name, $direccion)
    {
        $this->remove($name, $direccion);
    }

    public function renameProject($newname, $oldname)
    {
        if (rename(
            $this->_dirWorkspace . $oldname,
            $this->_dirWorkspace . $newname
        )) {
            return true;
        }

        return false;
    }

    private function addNombreProyecto(
        $nameProject,
        $type = 'workspaces',
        $uri = false
    )
    {
        $filename = ($type == 'workspaces')
            ? $this->_dirWorkspace . $nameProject . '/index.html' : $this->_dirPathApps . $uri . '/help/index.html';
        $this->_document->loadHTMLFile($filename);
        $div = $this->_document->getElementById('menu-indice');
        $li = $this->_document->createElement('li');
        $a = $this->_document->createElement('a', $nameProject);
        $time = time() + rand(100000, 1000000000);
        $idProject = $time;
        $attributeLi = $this->_document->createAttribute('id');
        $attributeLi->value = 'xhome' . $idProject;
        $attributeA = $this->_document->createAttribute('href');
        $attributeA->value = '#xhome' . $idProject . '_context';
        $attributeLiClass = $this->_document->createAttribute('class');
        $attributeLiClass->value = 'active xinitProyect';
        $a->appendChild($attributeA);
        if ($type == 'framework') {
            $attributeUri = $this->_document->createAttribute('uri');
            $attributeUri->value = $uri;
            $a->appendChild($attributeUri);
        } else {
            $attributeUri = $this->_document->createAttribute('uri');
            $attributeUri->value = 'workspaces';
            $a->appendChild($attributeUri);
        }
        $li->appendChild($attributeLi);
        $li->appendChild($attributeLiClass);
        $li->appendChild($a);
        $div->appendChild($li);
        $this->_document->saveHTMLFile($filename);
        $this->createcontenido($filename, 'xhome' . $idProject);
    }

    private function createcontenido($dirfilename, $idIndice)
    {
        $idPadre = 'context';
        $this->_document->loadHTMLFile($dirfilename);
        $div = $this->_document->getElementById($idPadre);
        $newdiv = $this->_document->createElement('div');
        $attributeDivClass = $this->_document->createAttribute('class');
        $attributeDivClass->value = "bs-docs-section";
        $attributeDivId = $this->_document->createAttribute('id');
        $attributeDivId->value = $idIndice . '_context';
        $section = $this->_document->createElement('section');
        $newdiv->appendChild($attributeDivClass);
        $newdiv->appendChild($attributeDivId);
        $newdiv->appendChild($section);
        $div->appendChild($newdiv);
        $this->_document->saveHTMLFile($dirfilename);
    }

    private function copyPaste($nameProject, $origen, $destino)
    {
        $nameProject = str_replace(" ", "\\ ", $nameProject);
        $cmd = 'cp -R ' . $origen . $nameProject . ' ' . $destino;
        $var = shell_exec($cmd);

        return $var;
    }

    private function remove($nameProject, $origen)
    {
        $nameProject = str_replace(" ", "\\ ", $nameProject);
        $cmd = 'rm -R ' . $origen . $nameProject;
        shell_exec($cmd);
    }
}
