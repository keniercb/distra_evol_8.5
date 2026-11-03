<?php

class AyudaController extends ZendExt_Controller_Secure
{

    public $filename;
    public $document;
    public $indice;
    public $proyecto;
    public $session;
    public $dirPathApps;

    function init()
    {
        parent::init();
        $this->document = new DOMDocument();
        $this->proyecto = new ManejadorProyectoModel($this->document);
        $this->filenamexml = dirname(__FILE__) . '/../../comun/recursos/xml/aplicaciones.xml';
        $this->dirPathApps = dirname(__FILE__) . '/../../../web/';
    }

    public function getTemplatesAction()
    {
        $arr = array(
            array(
                'title' => 'Some title 1',
                'description' => 'Some desc 1',
                'url' => 'resources/plantillas/ha.htm'
            ),
            array(
                'title' => 'Some title 2',
                'description' => 'Some desc 2',
                'url' => 'resources/plantillas/test.htm'
            )
        );
        echo json_encode($arr);
    }

    public function listarSubsistemasAction()
    {
        if (!OFF_LINE) {
            $subSistemas = $this->integrator->seguridad->obtenerDatosSubsistemas();
            foreach ($subSistemas as $value) {
                if (!is_dir(
                    $this->dirPathApps . (string)$value['uri'] . '/help'
                )
                ) {
                    $tmp[] = array(
                        'nombre' => $value['denominacion'],
                        'uri' => $value['uri']
                    );
                }
            }
        }
        echo json_encode($tmp);
    }

    /* Acciones de gestion de indice */
    public function addIndiceAction()
    {
        $idNodo = $this->_request->getParam('idNodo');
        $nameIndice = $this->_request->getParam('nameindice');
        $name = $this->_request->getParam('name');
        $uri = $this->_request->getParam('uri');
        $idpadre = $this->_request->getParam('idpadre');
        $reference = $this->_request->getParam('reference');
        $tmp = explode('#', $idpadre);
        $idpadre = $tmp[1];
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename = dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $name . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->indice = new ManejadorIndiceModel(
            $this->document, $this->filename
        );
        $result = $this->indice->addIndice($idpadre, $idNodo, $nameIndice, $reference);
        if ($result == 2) {
            echo json_encode(array('success' => false, 'mensaje' => 'El indice que quiere adicionar ya existe.'));
        } elseif ($result == 3) {
            echo json_encode(
                array(
                    'success' => false,
                    'mensaje' => 'La referencia del indice que quiere adicionar ya
            existe.'
                )
            );
        } else {
            echo json_encode(array('success' => true));
        }
    }

    public function reNameIndiceAction()
    {
        $identificador = $this->_request->getParam('idNodo');
        $newName = $this->_request->getParam('newname');
        $name = $this->_request->getParam('name');
        $uri = $this->_request->getParam('uri');
        $reference = $this->_request->getParam('reference');
        // $subAction = $this->_request->getParam('referenci');
        $tmp = explode('#', $identificador);
        $identificador = $tmp[1];
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename = dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $name . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->indice = new ManejadorIndiceModel(
            $this->document, $this->filename
        );
        $result = $this->indice->reNameIndice($identificador, $newName, $reference);
        if ($result == 2) {
            echo json_encode(array('success' => false, 'mensaje' => 'El indice ya existe.'));
        } elseif ($result == 3) {
            echo json_encode(array('success' => false, 'mensaje' => 'La referencia del indice ya existe.'));
        } else {
            echo json_encode(array('success' => true));
        }
    }

    public function reNameProjectAction()
    {
        $identificador = $this->_request->getParam('idNodo');
        $newName = $this->_request->getParam('newname');
        $name = $this->_request->getParam('name');
        $uri = $this->_request->getParam('uri');
        $tmp = explode('#', $identificador);
        $identificador = $tmp[1];
        $reference = $this->_request->getParam('reference');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        if (empty($newName)) {
            $msg = "El nombre del proyecto no puede ser nulo";
            echo json_encode(
                array(
                    "succes" => false,
                    "codMsg" => 6,
                    "mensaje" => $msg
                )
            );

            return;
        }
        if ($type == 'workspaces' && file_exists(dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $newName)
        ) {
            $msg = "Ya exixte un proyecto con ese nombre.";
            echo json_encode(
                array(
                    "succes" => false,
                    "codMsg" => 6,
                    "mensaje" => $msg
                )
            );

            return;
        }

            if ($type == 'workspaces') {
                $this->filename = dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $name . '/index.html';
                $this->indice = new ManejadorIndiceModel(
                    $this->document, $this->filename
                );
                $this->indice->reNameIndice(
                    $identificador,
                    $newName,
                    $reference
                );
                $this->indice->reNameIdLi($name, $newName);
                $this->proyecto->renameProject($newName, $name);
                $msg = "El proyecto ha sido modificado satisfactoriamente.";
                echo json_encode(
                    array(
                        "succes" => true,
                        "codMsg" => 1,
                        "mensaje" => $msg
                    )
                );
            }

    }

    public function deleteIndiceAction()
    {
        $identificador = $this->_request->getParam('idNodo');
        $name = $this->_request->getParam('name');
        $tmp = explode('#', $identificador);
        $identificador = $tmp[1];
        $uri = $this->_request->getParam('uri');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename = dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $name . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->indice = new ManejadorIndiceModel(
            $this->document, $this->filename
        );
        $this->indice->deleteIndice($identificador);
        echo json_encode(array('success' => true));
    }

    public function deleteProjectAction()
    {
        $name = $this->_request->getParam('name');
        $uri = $this->_request->getParam('uri');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        if ($type == 'workspaces') {
            $this->filename = dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/';
            $this->proyecto->deleteProject($name, $this->filename);
        } else {
            $this->filename = $this->dirPathApps . $uri . '/';
            $this->proyecto->deleteProject('help', $this->filename);
        }
        $msg = "El proyecto ha sido eliminado satisfactoriamente.";
        echo json_encode(
            array(
                "succes" => true,
                "codMsg" => 1,
                "mensaje" => $msg
            )
        );
    }

    /* Acciones de gestion de proyecto */
    public function listarProjectoAction()
    {
        $arreglo = $this->proyecto->listarProjecto();
        echo json_encode($arreglo);
    }

    public function cargarProjectoAction()
    {
        $name = $this->_request->getParam('nameproject');
        $idNodo = $this->_request->getParam('idNodo');
        $type = $this->_request->getParam('type');
        $uri = $this->_request->getParam('uri');
        $html = $this->proyecto->cargarProjecto($name, $idNodo, $type, $uri);
        echo json_encode(
            array(
                'menu' => $html,
                'project' => $name,
                'succes' => true,
                'mensaje' => 'El proyecto ha sido cargado satisfactoriamente.'
            )
        );
    }

    public function exportarProyectoAction()
    {
        $name = $this->_request->getParam('name');
        $uri = $this->_request->getParam('uri');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        $location = $this->proyecto->exportarProyecto($name, $type, $uri);
        echo json_encode(
            array(
                'data' => $location
            )
        );
    }

    public function nuevoProyectoAction()
    {
        $newProject = $this->_request->getParam("nameproject");
        $uri = $this->_request->getParam('uri');
        $type = $this->_request->getParam('type');
        if ($type == 'workspaces') {
            $uri = false;
        }
        $respuesta = $this->proyecto->nuevoProyecto($newProject, $type, $uri);
        echo json_encode($respuesta);
    }

    public function importarProyectoAction()
    {
        $case = $this->proyecto->importarProyecto();
        echo json_encode($case);
    }

    /* Acciones de gestionar contenido */
    public function guardarAction()
    {
        $this->document = new DOMDocument();
        $idIndice = $this->_request->getParam('idNodo');
        $contenido = $this->_request->getParam('contens');
        $nombreProyecto = $this->_request->getParam('name');
        /* Cargar el html */
        $uri = $this->_request->getParam('uri');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename =
                    dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $nombreProyecto . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->document->loadHTMLFile($this->filename);
        $this->document->formatOutput = true;
        /* Verificar si es guardar nuevo contenido o modificar */
        $modificar = $this->document->getElementById($idIndice . '_context');
        /* Cargar el contenido como un html */
        $fragmento = new DOMDocument();
        /* verificar si el contenido viene entre la etiqueta section */
        /* Colacamos el contenido dentro de la etiqueta section */
        $html = '<section>' . $contenido . '</section>';
        $html = ManejadorProyectoModel::modificarreferencia(
            $html,
            "source",
            "src",
            $nombreProyecto,
            'guardar',
            $uri
        );
        $html = ManejadorProyectoModel::modificarreferencia(
            $html,
            "img",
            "src",
            $nombreProyecto,
            'guardar',
            $uri
        );
        $html = ManejadorProyectoModel::modificarreferencia(
            $html,
            "a",
            "href",
            $nombreProyecto,
            'guardar',
            $uri
        );
        $html = ManejadorProyectoModel::modificarreferencia(
            $html,
            "video",
            "src",
            $nombreProyecto,
            'guardar',
            $uri
        );
        $fragmento->loadHTML($html);
        $body = $fragmento->getElementsByTagName('body');
        $sections = $body->item(0)->firstChild;
        /*
         * eliminar si tiene contenido
         */
        $childrens = $modificar->childNodes;
        $len = $childrens->length;
        for ($i = 0; $i < $len; $i++) {
            if ($childrens->item($i)->nodeName == 'section') {
                $modificar->removeChild($childrens->item($i));
                break;
            }
        }
        /*cambiar referencia de las imagenes y video*/
        //*$children = $sections->item(0)->childNodes;
        /*foreach ($children as $hijo){*/
        $node = $this->document->importNode($sections, true);
        if ($modificar->hasChildNodes()) {
            $modificar->insertBefore($node, $modificar->firstChild);
        } else {
            $modificar->appendChild($node);
        }
        /*  }*/
        $this->document->saveHTMLFile($this->filename);
        echo json_encode(
            array(
                "succes" => true,
                "codMsg" => 1,
                "mensaje" => 'El contenido ha sido guardado satisfactoriamente.'
            )
        );
    }

    public function getContenidoAction()
    {
        $idIndice = $this->_request->getParam("idNodo");
        $nombreProyecto = $this->_request->getParam("name");
        $uri = $this->_request->getParam('uri');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename =
                    dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $nombreProyecto . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->document->loadHTMLFile($this->filename);
        $div = $this->document->getElementById($idIndice . '_context');
        if ($div) {
            $divOne = $div->childNodes;
            $len = $divOne->length;
            $node = null;
            for ($i = 0; $i < $len; $i++) {
                if ($divOne->item($i)->nodeName == 'section') {
                    $node = $divOne->item($i);
                    break;
                }
            }
            if ($node != null) {
                if ($node->childNodes->length == 0) {
                    echo json_encode(
                        array(
                            'data' => "",
                        )
                    );
                } else {
                    $contenido = $this->document->saveHTML($node);
                    $contenido = ManejadorProyectoModel::modificarreferencia(
                        $contenido,
                        'source',
                        "src",
                        $nombreProyecto,
                        'contenido',
                        $uri
                    );
                    $contenido = ManejadorProyectoModel::modificarreferencia(
                        $contenido,
                        'img',
                        "src",
                        $nombreProyecto,
                        'contenido',
                        $uri
                    );
                    $contenido = ManejadorProyectoModel::modificarreferencia(
                        $contenido,
                        "a",
                        "href",
                        $nombreProyecto,
                        'contenido',
                        $uri
                    );
                    $contenido = ManejadorProyectoModel::modificarreferencia(
                        $contenido,
                        "video",
                        "src",
                        $nombreProyecto,
                        'contenido',
                        $uri
                    );
                    $contenido = str_replace('<section>', '', $contenido);
                    $contenido = str_replace('</section>', '', $contenido);
                    echo json_encode(
                        array(
                            'data' => $contenido
                        )
                    );
                }
            }
        }
    }

    public function importarIndiceAction()
    {
        $idIndice = $this->_request->getParam("idNodo");
        $nombreProyecto = $this->_request->getParam("name");
        $uri = $this->_request->getParam('uri');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename =
                    dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $nombreProyecto . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->indice = new ManejadorIndiceModel(
            $this->document, $this->filename
        );
        $respusta = $this->indice->importarIndice(
            $idIndice,
            $nombreProyecto,
            $type,
            $uri
        );
        echo json_encode($respusta);
    }

    public function exportarIndiceAction()
    {
        $idIndice = $this->_request->getParam("idNodo");
        $nombreProyecto = $this->_request->getParam("name");
        $uri = $this->_request->getParam('uri');
        $tmp = explode('#', $idIndice);
        $idIndice = $tmp[1];
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename =
                    dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $nombreProyecto . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->indice = new ManejadorIndiceModel(
            $this->document, $this->filename
        );
        $respuesta = $this->indice->exportarIndice(
            $idIndice,
            $nombreProyecto,
            $type,
            $uri
        );
        echo json_encode(
            array(
                "location" => $respuesta
            )
        );
    }

    public function administracionAction()
    {
        $this->render();
    }

    public function sortMenuAction()
    {
        $idIndice = $this->_request->getParam("idIndex");
        $posIndes = $this->_request->getParam("posIndes");
        $parentId = $this->_request->getParam('parentId');
        $nombreProyecto = $this->_request->getParam("name");
        $uri = $this->_request->getParam('uri');
        $type = ($uri == 'workspaces') ? 'workspaces' : 'framework';
        switch ($type) {
            case 'workspaces':
                $this->filename =
                    dirname(__FILE__) . '/../../../web/zeolhelp/workspaces/' . $nombreProyecto . '/index.html';
                break;
            case 'framework':
                $this->filename = $this->dirPathApps . $uri . '/help/index.html';
                break;
        }
        $this->indice = new ManejadorIndiceModel(
            $this->document, $this->filename
        );
        $result = $this->indice->sortMenu($parentId, $idIndice, $posIndes);
        if ($result) {
            echo json_encode(
                array(
                    'success' => true,
                    'msg' => 'El indice ha sido modificado satisfactoriamente'
                )
            );

            return;
        }
        echo json_encode(
            array(
                'success' => false,
                'msg' => 'El contenido de la ayuda no tiene permiso de lectura o de escritura.'
            )
        );
    }
}





