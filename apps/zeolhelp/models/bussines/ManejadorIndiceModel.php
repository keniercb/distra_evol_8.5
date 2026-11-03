<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class ManejadorIndiceModel extends ZendExt_Model
{

    private $_filename;
    private $_document;

    function ManejadorIndiceModel(DOMDocument $document, $_filename)
    {
        parent::ZendExt_Model();
        $this->_document = $document;
        $this->_filename = $_filename;
    }

    public function addIndice($idpadre, $idntificadcor, $name, $reference)
    {
        $result = $this->createIndice($idpadre, $idntificadcor, $name, $reference);
        if ($result == 1) {
            $this->createContent($idpadre, $idntificadcor);
        }

        return $result;
    }

    public function reNameIndice($identificador, $newName, $reference = false)
    {
        /*
        * return 1 caso de exito
        * return 2 caso de Indice existe
        * return 3 caso de Referencia existe
        *
        * */
        $this->_document->loadHTMLFile($this->_filename);
        $div = $this->_document->getElementById($identificador);
        $mane = new ManejadorEstructura();
        $a = $mane->getElement($div->childNodes, 'a');
        $name = $a->nodeValue;
        if ($name != $newName) {
            $attributes = $div->parentNode->parentNode->attributes;
            $attr = $attributes->getNamedItem('id');
            $id = $attr->value;
            $element = $this->_document->getElementById($id);
            if ($this->existeIndice($element, $newName)) {
                return 2;
            }
        }
        $attributes = $div->attributes;
        $title = $attributes->getNamedItem('title');
        if ($title->value != $reference) {
            $element = $this->_document->getElementById('menu-indice');
            if ($this->existeReferencia($element, $reference)) {
                return 3;
            }
        }
        if ($reference || $reference == '') {
            $div->setAttribute('title', $reference);
        }
        /* if($reference){
             $attributeTitle = $this->_document->createAttribute('title');
             $attributeTitle->value = $reference;
             $div->appendChild($attributeTitle);
         }*/
        $a = $this->getElement($div, 'a');
        if ($a) {
            $a->nodeValue = $newName;
        }
        $this->_document->saveHTMLFile($this->_filename);

        return 1;
    }

    public function deleteIndice($identificador)
    {
        $this->_document->loadHTMLFile($this->_filename);
        $div = $this->_document->getElementById($identificador);
        $div->parentNode->removeChild($div);
        $contenido = $this->_document->getElementById(
            $identificador . '_context'
        );
        if ($contenido) {
            $contenido->parentNode->removeChild($contenido);
        }
        $this->_document->saveHTMLFile($this->_filename);
    }

    public function reNameIdLi($name, $newname)
    {
        $newname = str_replace(" ", "", $newname);
        $name = str_replace(" ", "", $name);
        $contenido = file_get_contents($this->_filename);
        $contenido = str_replace("xhome$name", "xhome$newname", $contenido);
        $handle = fopen($this->_filename, 'w+');
        fwrite($handle, $contenido);
        fclose($handle);
    }

    private function createContent($idpadre, $idIndice)
    {
        $this->_document->loadHTMLFile($this->_filename);
        $padre = $this->_document->getElementById($idpadre . '_context');
        $newdiv = $this->_document->createElement('div');
        $attributeDivClass = $this->_document->createAttribute('class');
        $attributeDivClass->value = "bs-docs-section";
        $attributeDivId = $this->_document->createAttribute('id');
        $attributeDivId->value = $idIndice . '_context';
        $section = $this->_document->createElement('section');
        $newdiv->appendChild($attributeDivClass);
        $newdiv->appendChild($attributeDivId);
        $newdiv->appendChild($section);
        $padre->appendChild($newdiv);
        $this->_document->saveHTMLFile($this->_filename);
    }

    private function createIndice($idPadre, $idntificadcor, $name, $reference)
    {
        /*
         * return 1 caso de exito
         * return 2 caso de Indice existe
         * return 3 caso de Referencia existe
         *
         * */
        $this->_document->loadHTMLFile($this->_filename);
        $div = $this->_document->getElementById($idPadre);
        if ($this->existeIndice($div, $name)) {
            return 2;
        }
        if ($this->existeReferencia($div, $reference)) {
            return 3;
        }
        /* Crear Elemento */
        $li = $this->_document->createElement('li');
        $a = $this->_document->createElement('a', $name);
        $attributeLi = $this->_document->createAttribute('id');
        $attributeLi->value = $idntificadcor;
        $attributeTitle = $this->_document->createAttribute('title');
        $attributeTitle->value = $reference;
        $li->appendChild($attributeTitle);
        $li->appendChild($attributeLi);
        $attributeA = $this->_document->createAttribute('href');
        $attributeA->value = "#" . str_replace(" ", "", $idntificadcor) . '_context';
        $a->appendChild($attributeA);
        $li->appendChild($a);
        $ulMayor = $div->getElementsByTagName('ul');
        $cantidad = $ulMayor->length;
        if ($cantidad > 0) {
            $ulMayor->item(0)
                ->appendChild($li);
        } else {
            $ul = $this->_document->createElement('ul');
            $attributeUl = $this->_document->createAttribute('class');
            $attributeUl->value = 'nav';
            $ul->appendChild($attributeUl);
            $ul->appendChild($li);
            $div->appendChild($ul);
        }
        $this->_document->saveHTMLFile($this->_filename);

        return 1;
    }

    private function getElement(DOMElement $element, $nameElemnt)
    {
        $childList = $element->childNodes;
        foreach ($childList as $child) {
            if ($child->nodeName == $nameElemnt) {
                return $child;
            }
        }

        return false;
    }

    public function importarIndice(
        $idIndice,
        $nameProject,
        $type = 'workspaces',
        $uri = false
    )
    {
        $directorio = ($type == 'workspaces')
            ? dirname(__FILE__) . '/../../../../web/zeolhelp/workspaces/' :
            dirname(__FILE__) . '/../../../../web/' . $uri . '/help/';
        /* copiar el zip */
        $dirRepo = dirname(__FILE__) . '/../../../../web/zeolhelp/repositorio/';
        shell_exec('rm -R ' . $dirRepo . '*');
        $targetPath = $dirRepo . $_FILES['file']['name'];
        $name = $_FILES['file']['name'];
        $tmp = explode('.', $name);
        $length = count($tmp);
        if ($tmp[$length - 1] == 'zip') {
            if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
                $zip = new ZipArchive;
                if ($zip->open($targetPath) === true) {
                    $arrays = explode(
                        '/',
                        $zip->getNameIndex($zip->numFiles - 1)
                    );
                    $name = $arrays[0];
                    $zip->extractTo($dirRepo);
                    $zip->close();
                    $manejador = new ManejadorEstructura();
                    if ($manejador->importSumVerify($dirRepo, $name)) {
                        $donDocument = new DOMDocument();
                        $dirindex = $dirRepo . $name . '/index.html';
                        $donDocument->loadHTMLFile($dirindex);
                        $ul = $donDocument->getElementById('menu-indice');
                        $div = $donDocument->getElementById('context');
                        if ($manejador->validatecontext($ul, $div)) {
                            $this->_document->loadHTMLFile($this->_filename);
                            $this->_document->formatOutput = true;
                            $liproject = $this->_document->getElementById(
                                $idIndice
                            );
                            $divContext = $this->_document->getElementById(
                                $idIndice . '_context'
                            );
                            /*Validar si el indice existe*/
                            $arrValueId = array();
                            $ulIndice = $this->_document->getElementById(
                                'menu-indice'
                            );
                            $nodeList = $ulIndice->childNodes;
                            $this->getArraysreidValue($nodeList, $arrValueId);
                            if ($this->combinarId(
                                $ul,
                                $div,
                                $arrValueId
                            )
                            ) {
                                $contenido = $donDocument->saveHTML();
                                $donDocument->loadHTML($contenido);
                                $ul = $donDocument->getElementById(
                                    'menu-indice'
                                );
                                $li = $manejador->getElement(
                                    $ul->childNodes,
                                    'li'
                                );
                                if ($this->existeIndice($liproject, $li->nodeValue)) {
                                    $msg = 'El Indice que quiere importar ya exixte.';

                                    return array(
                                        'succes' => false,
                                        'codMsg' => 6,
                                        'mensaje' => $msg
                                    );
                                }
                                $li = $this->_document->importNode($li, true);
                                $div = $donDocument->getElementById('context');
                                $div = $manejador->getElement(
                                    $div->childNodes,
                                    'div'
                                );
                                $div = $this->_document->importNode($div, true);
                                if ($liproject->childNodes->length > 1) {
                                    $liUl = $manejador->getElement(
                                        $liproject->childNodes,
                                        'ul'
                                    );
                                    $liUl->appendChild($li);
                                } else {
                                    $liUl = $this->_document->createElement(
                                        'ul'
                                    );
                                    $attributeUl = $this->_document->createAttribute(
                                        'class'
                                    );
                                    $attributeUl->value = 'nav';
                                    $liUl->appendChild($attributeUl);
                                    $liUl->appendChild($li);
                                }
                                $liproject->appendChild($liUl);
                                $divContext->appendChild($div);
                                $this->_document->saveHTMLFile($this->_filename);
                                if ($type == 'workspaces') {
                                    $this->copyPaste(
                                        $dirRepo . $name . '/resources/images/*',
                                        $directorio . $nameProject . '/resources/images/',
                                        true
                                    );
                                } else {
                                    $this->copyPaste(
                                        $dirRepo . $name . '/resources/images/*',
                                        $directorio . 'resources/images/',
                                        true
                                    );
                                }
                                $this->_document->loadHTMLFile($this->_filename);
                                $ul = $this->_document->getElementById(
                                    'menu-indice'
                                );
                                $msg = 'El indice ha sido
                                importado satisfactoriamente.';

                                return array(
                                    'succes' => true,
                                    'codMsg' => 1,
                                    'mensaje' => $msg,
                                    "html" => $this->_document->saveHTML($ul)
                                );
                            } else {
                                $msg = 'El indice que quiere importar ya exixte.';

                                return array(
                                    'succes' => false,
                                    'codMsg' => 6,
                                    'mensaje' => $msg
                                );
                            }
                        } else {
                            $msg = "El indice $name no ha sido importado debido a que" .
                                " se ha modificado indebidamente.";

                            return array(
                                'succes' => false,
                                'codMsg' => 6,
                                'mensaje' => $msg
                            );
                        }
                    } else {
                        $msg =
                            "El indice $name no ha sido importado debido a que" . " se ha modificado indebidamente.";

                        return array(
                            'succes' => false,
                            'codMsg' => 6,
                            'mensaje' => $msg
                        );
                    }
                } else {
                    $msg = "El indice $name no ha sido importado debido a que" . " se ha modificado indebidamente.";

                    return array(
                        'succes' => false,
                        'codMsg' => 6,
                        'mensaje' => $msg,
                    );
                }
            } else {
                return array(
                    'succes' => false,
                    'codMsg' => 6,
                    'mensaje' => 'Ocurrio un error en el servidor.'
                );
            }
        } else {
            $msg = "El indice $name no ha sido importado debido a que" . " se ha modificado indebidamente.";

            return array(
                'succes' => false,
                'codMsg' => 6,
                'mensaje' => $msg
            );
        }
    }

    public function combinarId(
        DOMElement $ul,
        DOMElement $div,
        $arraysID
    )
    {
        if (!$ul) {
            return true;
        }
        $childNodes = $ul->childNodes;
        $next = true;
        foreach ($childNodes as $node) {
            if ($node->nodeName == 'li') {
                $id = $node->getAttribute('id');
                $idNuevo = "xhome" . uniqid() . '_' . md5(mt_rand()) . time();
                if (!array_key_exists($idNuevo, $arraysID)) {
                    $arraysID[$idNuevo] = true;
                    $node->setAttribute('id', $idNuevo);
                    $manejador = new ManejadorEstructura();
                    $a = $manejador->getElement($node->childNodes, 'a');
                    $a->setAttribute('href', '#' . $idNuevo . '_context');
                    $newdiv = $manejador->getDivByIdLi($div->childNodes, $id);
                    $newdiv->setAttribute('id', $idNuevo . '_context');
                    $newul = $manejador->getElement($node->childNodes, 'ul');
                    $next = $next && $this->combinarId($newul, $newdiv, $arraysID);
                } else {
                    return false;
                }
            }
        }

        return $next;
    }

    public function exportarIndice(
        $idIndice,
        $nameProject,
        $type = 'workspaces',
        $uri = false
    )
    {
        /*Limpair el repositorio*/
        $dirRepo = dirname(__FILE__) . '/../../../../web/zeolhelp/repositorio/';
        shell_exec('rm -R ' . $dirRepo . '*');
        $directorio =
            ($type == 'workspaces') ? dirname(__FILE__) . '/../../../../web/zeolhelp/workspaces/' . $nameProject . '/'
                : dirname(__FILE__) . '/../../../../web/' . $uri . '/help/';
        $dirCarpeta = $dirRepo . $idIndice;
        if (mkdir($dirCarpeta . '/resources/images', 0777, true)) {
            $this->_document->loadHTMLFile($this->_filename);
            $li = $this->_document->getElementById($idIndice);
            $context = $this->_document->getElementById($idIndice . '_context');
            $nodeList = $context->childNodes;
            $arrayDir = array();
            $this->getArraysreference($nodeList, $arrayDir);
            //copiar img video doc para la carpeta a exportar
            if (count($arrayDir) > 0) {
                foreach ($arrayDir as $dir) {
                    $dir = str_replace("%20", " ", $dir);
                    if (file_exists($directorio . $dir)) {
                        $dirname = dirname($dir);
                        mkdir($dirCarpeta . '/' . $dirname, 0777, true);
                        $this->copyPaste(
                            $directorio . $dir,
                            $dirCarpeta . '/' . $dirname
                        );
                    }
                }
            }
            $this->_document->loadHTMLFile($this->_filename);
            $li = $this->_document->getElementById($idIndice);
            /*Eliminar el attr class del li padre si es el indice del proyecto*/
            $this->deleteAttr($li, 'class');
            /*Eliminar el attr uri al nodo a*/
            $manejador = new ManejadorEstructura();
            $a = $manejador->getElement($li->childNodes, 'a');
            $this->deleteAttr($a, 'uri');
            $context = $this->_document->getElementById($idIndice . '_context');
            $domDocumet = new DOMDocument('1.0');
            $domDocumet->formatOutput = true;
            $html = $domDocumet->createElement('html');
            $head = $domDocumet->createElement('head');
            $body = $domDocumet->createElement('body');
            $ul = $domDocumet->createElement('ul');
            $attributeUl = $domDocumet->createAttribute('id');
            $attributeUl->value = 'menu-indice';
            $attributeUlClass = $domDocumet->createAttribute('class');
            $attributeUlClass->value = 'nav';
            $ul->appendChild($attributeUl);
            $ul->appendChild($attributeUlClass);
            $div = $domDocumet->createElement('div');
            $attributeDiv = $domDocumet->createAttribute('id');
            $attributeDiv->value = 'context';
            $attributeDivClass = $domDocumet->createAttribute('class');
            $attributeDivClass->value = 'bs-docs-section';
            $div->appendChild($attributeDiv);
            $div->appendChild($attributeDivClass);
            $li = $domDocumet->importNode($li, true);
            $context = $domDocumet->importNode($context, true);
            $ul->appendChild($li);
            $div->appendChild($context);
            $body->appendChild($ul);
            $body->appendChild($div);
            $html->appendChild($head);
            $html->appendChild($body);
            $domDocumet->appendChild($html);
            $htmlfile = $dirCarpeta . '/index.html';
            $contenido = $domDocumet->saveHTML();
            $documento = htmlspecialchars_decode($contenido);
            $handle = fopen($htmlfile, 'w+');
            fwrite($handle, $documento);
            fclose($handle);
            $manejador = new ManejadorEstructura();
            $manejador->exportSumVerify($dirRepo, $idIndice);
            /* comprimir la carpeta */
            $nameExport = str_replace(" ", "", $nameProject);
            shell_exec(
                'cd ' . $dirRepo . '; zip -r ' . $nameExport . '_indice' . '.zip ' . $idIndice
            );
            /*eliminar la carpeta*/
            shell_exec('rm -R ' . $dirRepo . $idIndice);

            return $_SERVER['HTTP_HOST'] . '/zeolhelp/repositorio/' . $nameExport . '_indice' . '.zip';
        }
    }

    private function copyPaste($origen, $destino, $recursivo = false)
    {
        $origen = str_replace(" ", "\\ ", $origen);
        $destino = str_replace(" ", "\\ ", $destino);
        $cmd = ($recursivo) ? 'cp -R ' . $origen . ' ' . $destino : 'cp ' . $origen . ' ' . $destino;
        shell_exec($cmd);
    }

    private function getArraysreference(DOMNodeList $node, &$result)
    {
        $length = $node->length;
        for ($i = 0; $i < $length; $i++) {
            $elemento = $node->item($i);
            $nodelist = $elemento->childNodes;
            $this->getArraysreference($nodelist, $result);
            if ($elemento->hasAttributes()) {
                $listAtribute = $elemento->attributes;
                $longitud = $listAtribute->length;
                for ($j = 0; $j < $longitud; $j++) {
                    $newnode = $listAtribute->item($j);
                    if ($newnode->nodeName == 'src' || $newnode->nodeName == 'href'
                    ) {
                        $tmp = explode('/', $newnode->nodeValue);
                        if ($tmp[0] != 'http:' && $tmp[0] != 'https:' && $tmp[0] != 'ftp:'
                        ) {
                            $result[] = $newnode->nodeValue;
                        }
                    }
                }
            }
        }
    }

    private function getArraysreidValue(DOMNodeList $lisnode, &$result)
    {
        $length = $lisnode->length;
        for ($i = 0; $i < $length; $i++) {
            $elemento = $lisnode->item($i);
            $nodelist = $elemento->childNodes;
            if ($elemento->hasAttributes() && $elemento->nodeName == 'li') {
                $listAtribute = $elemento->attributes;
                $longitud = $listAtribute->length;
                for ($j = 0; $j < $longitud; $j++) {
                    $newnode = $listAtribute->item($j);
                    if ($newnode->nodeName == 'id') {
                        $result[$newnode->nodeValue] = true;
                    }
                }
            }
            $this->getArraysreidValue($nodelist, $result);
        }
    }

    private function deleteAttr(DOMElement $element, $nameAttr)
    {
        if ($element->getAttribute($nameAttr)) {
            $element->removeAttribute($nameAttr);
        }
    }

    private function existeIndice(DOMElement $element, $nameIndice)
    {
        if ($element) {
            $arraysLi = $element->getElementsByTagName('li');
            $length = $arraysLi->length;
            for ($i = 0; $i < $length; $i++) {
                $node = $arraysLi->item($i);
                if ($node->nodeValue == $nameIndice) {
                    return true;
                }
            }
        }

        return false;
    }

    private function existeReferencia(DOMElement $element, $reference)
    {
        if ($element && $reference != '') {
            $arraysLi = $element->getElementsByTagName('li');
            $length = $arraysLi->length;
            for ($i = 0; $i < $length; $i++) {
                $node = $arraysLi->item($i);
                $attributes = $node->attributes;
                $title = $attributes->getNamedItem('title');
                if ($title->value == $reference) {
                    return true;
                }
            }
        }

        return false;
    }


    public function sortMenu($idPadre, $idIndice, $pos)
    {
        if (!is_readable($this->_filename)) {
            return false;
        }
        $this->_document->loadHTMLFile($this->_filename);
        /*Cojer en indice y eliminarlo*/
        $limenu = $this->_document->getElementById($idIndice);
        $tmpLiMenu = $limenu;
        $limenu->parentNode->removeChild($limenu);
        /*Cojer en contex y eliminarlo*/
        $divContext = $this->_document->getElementById($idIndice . '_context');
        $tmpdivContext = $divContext;
        $divContext->parentNode->removeChild($divContext);
        /*Add index en el padre en su nueva pos  y Add contex en el padre en su nueva pos*/
        $lipadre = $this->_document->getElementById($idPadre);
        $divContextPadre = $this->_document->getElementById($idPadre . '_context');
        $manejador = new ManejadorEstructura();
        $ul = $manejador->getElement($lipadre->childNodes, 'ul');
        if (is_null($ul)) {
            $ul = $this->_document->createElement('ul');
            $attributeUl = $this->_document->createAttribute('class');
            $attributeUl->value = 'nav';
            $ul->appendChild($attributeUl);
            $ul->appendChild($tmpLiMenu);
            $divContextPadre->appendChild($tmpdivContext);
        } else {
            $arrayCountHijos = $manejador->countChildrensDistintLiandText($ul);
            if ($pos == $arrayCountHijos['equals']) {
                $ul->appendChild($tmpLiMenu);
                $divContextPadre->appendChild($tmpdivContext);
            } else {
                $node = $manejador->getNodoByPost($ul, $pos + 1, 'li');
                $ul->insertBefore($tmpLiMenu, $node);
                $nodeDiv = $manejador->getNodoByPost($divContextPadre, $pos + 1, 'div');
                // var_dump($nodeDiv->nodeName);
                $divContextPadre->insertBefore($tmpdivContext, $nodeDiv);
                //  var_dump($this->_document->saveXML($divContextPadre));die;
            }
        }
        if (is_writable($this->_filename)) {
            $this->_document->saveHTMLFile($this->_filename);

            return true;
        }

        return false;
    }
}