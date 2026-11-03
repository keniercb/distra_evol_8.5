<?php

/**
 * Manipula los xmls involucrados en el componente de notificaciones.
 *
 * @author Ernesto Herrera Morales
 */
class XmlHandlerModel extends ZendExt_Model
{
    /**
     * Arreglo que almacena el contenido del archivo: notification.xml
     * y su dirección física.
     *
     * @var array
     */
    private $_xmlN;

    /**
     * Arreglo que almacena el contenido del archivo: notificationevents.xml
     * y su dirección física.
     *
     * @var array
     */
    private $_xmlNe;

    /**
     * Arreglo que almacena el contenido del archivo: weaver.xml
     * y su dirección física.
     *
     * @var array
     */
    private $_xmlW;

    /**
     * Arreglo que almacena el contenido del archivo: aspecttemplate.xml
     * y su dirección física.
     *
     * @var array
     */
    private $_xmlAt;

    /**
     * Arreglo que almacena el contenido del archivo: ioc.xml y
     * su dirección física
     *
     * @var array
     */
    private $_xmlIoc;

    /**
     * Arreglo que almacena el contenido del archico:
     * config.xml y su dirección física
     *
     * @var array
     */

    private $_xmlC;


    /**
     * Arreglo que almacena el contenido y el path de un xml que se
     * puede obtener mediante
     * la invocación al método mágico __get.
     *
     * @var array
     */
    private $_xmlRegistered;

    /**
     * Almacena los Ids de los archivos a manejar.
     *
     * @var array
     */
    private static $_xmlS
        = array(
            "weaver",
            "aspecttemplate",
            "notification",
            "notificationevents",
            "ioc",
            "config"
        );

    /**
     * Almacena los aspecttemplates correspondientes al
     * componente de notificaciones.
     *
     * @var array
     */
    private static $_notificationAts
        = array(
            "preNotification"                       => array("pre"),
            "postNotification"                      => array("post"),
            "failedNotification"                    => array("failed"),
            "preNotificationAndPostNotification"    => array("pre", "post"),
            "preNotificationAndFailedNotification"  => array("pre", "failed"),
            "postNotificationAndFailedNotification" => array("post", "failed"),
            "notification"                          => array("pre", "post",
                                                             "failed")
        );

    /**
     * Nombre del nodo del xml que identifica un aspecto.
     */
    const ASPECT_NODE = "aspect";

    /**
     * Nombre de los métodos que ejecutan los eventos sin el prefijo.
     */
    const ASPECT_METHOD = "DispatchEventNotification";

    /**
     * Nombre del nodo del xml que identifica un evento.
     */
    const EVENT_NODE = "event";

    /**
     * Nombre del nodo raiz del xml de las notificaciones de eventos.
     */
    const NE_ROOT = "notification_events";

    /**
     * Nombre del nodo raiz del xml de notificaciones.
     */
    const N_ROOT = "notification";

    /**
     * Nombre del nodo raiz del xml de relación de aspectos (tejedor).
     */
    const W_ROOT = "weaver";

    /**
     * Nombre del nodo raiz del xml de inversión de control (ioc).
     */
    const IoC_ROOT = "ioc";

    /**
     * __get
     * Función mágica para obtener el contenido y la referencia
     * de los xmls manejados en la clase.
     *
     * @param string $name Nombre del xml
     *
     * @return $this|SimpleXMLElement|string|null
     */
    public function  __get($name)
    {
        if (in_array($name, self:: $_xmlS)) {
            switch ($name) {
                case self::$_xmlS[0] :
                    $this->_xmlRegistered = $this->_xmlW;
                    break;
                case self::$_xmlS[1] :
                    $this->_xmlRegistered = $this->_xmlAt;
                    break;
                case self::$_xmlS[2] :
                    $this->_xmlRegistered = $this->_xmlN;
                    break;
                case self::$_xmlS[3] :
                    $this->_xmlRegistered = $this->_xmlNe;
                    break;
                case self::$_xmlS[4] :
                    $this->_xmlRegistered = $this->_xmlIoc;
                    break;
                case self::$_xmlS[5] :
                    $this->_xmlRegistered = $this->_xmlC;
                    break;
                default :
                    break;
            }

            return $this;
        } else {
            if ($name == 'xml') {
                return $this->_xmlRegistered['xml'];
            } elseif ($name == 'path') {
                return $this->_xmlRegistered['path'];
            }
        }

        return null;
    }

    /**
     * getXMLs
     * Devuelve el arreglo con los dirección y el contenido de los xmls.
     *
     * @return array
     */
    public function getXMLs()
    {
        return self::$_xmlS;
    }

    /**
     * getNodes
     * Adiciona los nodos especificados en el arreglo
     * como hijos del nodo raíz si estos no existen,
     * de lo contrario sólo se obtiene la referencia de estos.
     * Retorna la referencia de los nodos.
     *
     * @param  SimpleXMLElement $rootNode
     * @param  array            $arrayNodes
     *
     * @return array de SimpleXMLElement
     */
    public static function getNodes(SimpleXMLElement $rootNode, $arrayNodes)
    {
        $nodes[0] = new SimpleXMLElement($rootNode->asXML());
        foreach ($arrayNodes as $node) {
            $nodes[] = $node;
        }
        for ($i = 0; $i < count($nodes) - 1; $i++) {
            $nodes[$i + 1] = ($nodes[$i]->{$nodes[$i + 1]})
                ? $nodes[$i]->{$nodes[$i + 1]}
                : $nodes[$i]->addChild($nodes[$i + 1]);
        }

        return $nodes;
    }

    /**
     * simplexmlAppend
     * Agrega un objeto SimpleXMLElement como hijo de otro objeto
     * SimpleXMLElement especificado.
     *
     * @param SimpleXMLElement $parent
     * @param SimpleXMLElement $newChild
     */
    private function simplexmlAppend(
        SimpleXMLElement $parent, SimpleXMLElement $newChild
    )
    {
        $node1 = dom_import_simplexml($parent);
        $domSxe = dom_import_simplexml($newChild);
        $node2 = $node1->ownerDocument->importNode($domSxe, true);
        $node1->appendChild($node2);
    }

    /**
     * isNAT
     * Indica si el aspecttemplate especificado
     * es del componente de notificaciones.
     *
     * @param string $at
     *
     * @return boolean
     */
    private function isNAT($at)
    {
        foreach (self::$_notificationAts as $nat => $execs) {
            if ($at == $nat) {
                return true;
            }
        }

        return false;
    }

    /**
     * getAtomicAT
     * Devuelve el nombre del aspecttemplate que contiene únicamente
     * el aspecto de notificaciones que se relaciona con la ejecución
     * dada.
     *
     * @param string $exec
     *
     * @return string
     */
    private function getAtomicAT($exec)
    {
        $ats = array_keys(self::$_notificationAts);
        switch ($exec) {
            case 'pre':
                return $ats[0];
            case 'post':
                return $ats[1];
            default:
                return $ats[2];
        }
    }

    /**
     * getValidNAT
     * Retorna un aspectemplate de notificaciones válido
     * dado un antiguo aspectemplate, una ejecución del aspecto y una bandera
     * indicando si es o no una nueva ejecución para el viejo aspectemplate.
     *
     * @param string $oldAT
     * @param string $exec
     * @param bool   $newExec
     *
     * @return int|null|string
     */
    private function getValidNAT($oldAT, $exec, $newExec = true)
    {
        $oldExecs = array();
        if (is_string($exec) && is_string($oldAT)) {
            $oldExecs = self::$_notificationAts[$oldAT];
            if ($newExec) {
                $oldExecs [] = $exec;
            } else {
                $index = array_keys($oldExecs, $exec);
                if (count($index)) {
                    unset($oldExecs[$index[0]]);
                    $oldExecs = array_values($oldExecs);
                } else {
                    return $this->getAtomicAT($exec);
                }
            }
        } else {
            return null;
        }
        foreach (self::$_notificationAts as $nat => $execs) {
            if (count($oldExecs) == count($execs)) {
                $cantExpected = 0;
                for ($i = 0; $i < count($oldExecs); $i++) {
                    if (in_array($oldExecs[$i], $execs)) {
                        $cantExpected++;
                    } else {
                        break;
                    }
                }
                if ($cantExpected == count($oldExecs)) {
                    return $nat;
                }
            }
        }

        return null;
    }

    /**
     * isExpectedNAT
     * Indica si el aspecttemplate especificado es el esperado.
     *
     * @param string $exec
     * @param string $at
     *
     * @return boolean
     */
    private function isExpectedNAT($exec, $at)
    {
        return in_array($exec, self::$_notificationAts[$at]);
    }

    /**
     * validateAspecttemplate
     * Valida si el aspecttemplate especificado es válido para
     * el tipo de ejecución de aspecto dada, si no es válido
     * retorna uno válido.
     *
     * @param string $atn
     * @param string $exec
     *
     * @return string
     * @throws Exception
     * @throws ZendExt_Exception
     */
    private function validateAspecttemplate($atn, $exec)
    {
        //si tiene definido un at y no existe físicamente se lanza una excepción.        
        if (!$this->_xmlAt['xml']->$atn) {
            throw new ZendExt_Exception('HERRNOT004');
        }

        //si es un aspecttemplate de notificaciones (3, ..., 9)
        if ($this->isNAT($atn)) {
            //si no es el aspecttemplate esperado
            if (!$this->isExpectedNAT($exec, $atn)) {
                //obtener un aspecttemplate válido
                $validNAT = $this->getValidNAT($atn, $exec);
                if ($validNAT) {
                    $newNotificationAspectTemplate = $validNAT;
                } else {
                    //@TODO Agregar una excepción personalizada utilizando
                    //el componente ZendExt_Exception.
                    throw new Exception(
                        "No existe una plantilla de aspecto para
                        este tipo de evento."
                    );
                }
            }
        } else {
            //si no tiene definido un aspecttemplate de notificaciones
            //buscar en el aspecttemplate definido si existe el aspecto esperado.
            $aspects = $this->_xmlAt['xml']->$atn->children();
            $wasFinded = false;
            if (count($aspects) > 0) {
                foreach ($aspects as $aspect) {
                    if ($aspect['name'] == $exec . self::ASPECT_METHOD) {
                        $wasFinded = true;
                        $newNotificationAspectTemplate = $atn;
                        break;
                    }
                }
            }
            //si no se encontró el aspecto esperado se adiciona una
            //nueva plantilla de aspecto.
            if (!$wasFinded) {
                //Se obtiene un aspecttemplate válido
                $validNotificationAspectTemplate = $this->getValidNAT(
                    $atn, $exec
                );
                //Se conforma una nueva plantilla de aspecto
                $newNotificationAspectTemplate
                    = $atn . 'And' . ucfirst($validNotificationAspectTemplate);
                //Se verifica si no existe esta nueva plantilla de aspecto
                if (!$this->_xmlAt['xml']->$newNotificationAspectTemplate) {
                    //Si no existe se crea la nueva plantilla
                    $xmlAspectTemplate = new SimpleXMLElement(
                        $this->_xmlAt['xml']->asXML()
                    );
                    $aspectTemplateNode = $xmlAspectTemplate->addChild(
                        $newNotificationAspectTemplate
                    );
                    $aspects = $this->_xmlAt['xml']->$atn->children();
                    foreach ($aspects as $aspect) {
                        $aspectNode = $aspectTemplateNode->addChild(
                            self::ASPECT_NODE
                        );
                        $aspectNode->addAttribute('name', $aspect['name']);
                        $aspectNode->addAttribute(
                            'execution', $aspect['execution']
                        );
                    }
                    $aspectNode = $aspectTemplateNode->addChild(
                        self::ASPECT_NODE
                    );
                    $aspectNode->addAttribute(
                        'name', $exec . self::ASPECT_METHOD
                    );
                    $aspectNode->addAttribute('execution', $exec);
                    self::saveXml($xmlAspectTemplate, $this->_xmlAt['path']);
                }
            }
        }

        return $newNotificationAspectTemplate;
    }

    /**
     * defineActionIntoWeaver
     * Busca en el weaver la referencia de la acción o la define.
     *
     * @param string $exec
     * @param array  $nodes
     */
    private function defineActionIntoWeaver($exec, $nodes)
    {
        $actionNodeIndex = count($nodes);
        $xmlNodes = self::getNodes($this->_xmlW['xml'], $nodes);
//        Esto solo tiene en cuenta si la accion tiene un aspecttemplate y no se tiene en cuenta que en
//        caso contrario se debe verificar si el controlador o el modulo tienen un aspecttemplate
//        $aspecttemplateName = (string)$xmlNodes[$actionNodeIndex][self::$_xmlS[1]];
        for($i = $actionNodeIndex;$i > 0 ; $i--){
            $aspecttemplateName
                = (string)$xmlNodes[$i][self::$_xmlS[1]];
            if ($aspecttemplateName) {
                break;
            }
        }
        //si el weaver tiene definido un aspecttemplate para la acción
        //comprobar que es un aspecttemplate válido o crear uno.        
        if ($aspecttemplateName) {
            $newAspecttemplate = $this->validateAspecttemplate(
                $aspecttemplateName, $exec
            );
            //if ($aspecttemplateName != $newAspecttemplate) {
                $xmlNodes [$actionNodeIndex] [self::$_xmlS [1]]
                    = (string)$newAspecttemplate;
        //    }
        } else {
            //si en el weaver, la acción no tiene definido un aspecttemplate
            //le asigno el correspondiente
            if ($xmlNodes [$actionNodeIndex]->attributes()->{self::$_xmlS[1]}) {
                $xmlNodes [$actionNodeIndex]->attributes()->{self::$_xmlS[1]}
                    = $this->getAtomicAT($exec);
            } else {
                $xmlNodes [$actionNodeIndex]->addAttribute(
                    self::$_xmlS[1], $this->getAtomicAT($exec)
                );
            }
        }
        //guardo los cambios en el weaver
        self::saveXml($xmlNodes[0], $this->_xmlW['path']);
    }

    /**
     * checkEventExecution
     * Verifica si algún evento coincide con el tipo de ejecución.
     *
     * @param SimpleXMLElement $events
     * @param string           $exec
     *
     * @return boolean
     */
    public static function checkEventExecution(SimpleXMLElement $events, $exec)
    {
        if ($events instanceof SimpleXMLElement) {
            foreach ($events->children() as $event) {
                if ($event->attributes()->execution == $exec) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * asignNotificationEvent2Action
     * Asigna la ejecución del evento a una acción.
     *
     * @param string $name
     * @param string $exec
     * @param array  $nodes
     */
    private function asignNotificationEvent2Action($name, $exec, $nodes)
    {

        $xmlNodes = self::getNodes($this->_xmlN['xml'], $nodes);

        $actionNodeIndex = count($nodes);
        //si no está el nodo contenedor de eventos "events" lo creo
        if (!$xmlNodes[$actionNodeIndex]->{self::EVENT_NODE . "s"}) {
            $events = $xmlNodes[$actionNodeIndex]->addChild(
                self::EVENT_NODE . "s"
            );
        } else {
            $events = $xmlNodes[$actionNodeIndex]->{self::EVENT_NODE . "s"};
        }
        //creo el nodo "event" dentro de events
        $eventNode = $events->addChild(self::EVENT_NODE);
        $eventNode->addAttribute('name', $name);
        $eventNode->addAttribute('execution', $exec);

        self::saveXml($xmlNodes[0], $this->_xmlN['path']);
    }

    /**
     * deleteEventFromN
     * Borrar un evento del xml de Notificaciones (notification.xml).
     *
     * @param string $nombre
     * @param string $nodes
     * @param string $execution
     *
     * @return string
     */
    private function deleteEventFromN($nombre, $nodes, $execution = null)
    {
        $domXml = $this->getDomXML($this->_xmlN['path']);
        $xpath = new DOMXPath($domXml);
        $query = DIRECTORY_SEPARATOR . self :: N_ROOT .
            DIRECTORY_SEPARATOR . $nodes .
            DIRECTORY_SEPARATOR . self :: EVENT_NODE . 's' .
            DIRECTORY_SEPARATOR . self :: EVENT_NODE .
            "[@name=\"{$nombre}\"]";
        $evento = $xpath->query($query);
        if ($evento->item(0)) {
            $execution = $evento->item(0)->attributes->item(1)->nodeValue;
            $oldNode = $evento->item(0)->parentNode->removeChild(
                $evento->item(0)
            );
            if ($oldNode) {
                $domXml->save($this->_xmlN['path']);
            }
        }

        return $execution;
    }

    /**
     * updateAspectFromWeaver
     * Actualizar en el tejedor de aspectos (weaver.xml) la plantilla de
     * aspectos necesaria para ejecutar el evento.
     *
     * @param $nodes
     * @param $execution
     */
    private function updateAspectFromWeaver($nodes, $execution)
    {
        $dom = $this->getDomXML($this->_xmlW['path']);
        $xpath = new DOMXPath($dom);
        $query = DIRECTORY_SEPARATOR . self :: W_ROOT .
            DIRECTORY_SEPARATOR . $nodes;
        $action = $xpath->query($query);
        if ($action->item(0)) {
            $oldAtName = $action->item(0)->attributes->item(0)->nodeValue;
            $atomicAT = $this->getAtomicAT($execution);
            if ($oldAtName != $atomicAT) {
                //modificar el aspectemplate si la acción tiene otros aspectos
                if ($this->isNAT($oldAtName)) {
                    $newAtName = $this->getValidNAT(
                        $oldAtName, $execution, false
                    );
                    if ($newAtName != null) {
                        $action->item(0)->attributes->item(0)->nodeValue
                            = $newAtName;
                    } else {
                        $action->item(0)->parentNode->removeChild(
                            $action->item(0)
                        );
                    }
                } else {
                //@TODO: hacerlo para cuando
                    //no es un aspectemplate de notificaciones
                    $explodedOldAtName = explode('And', $oldAtName);
                    $aspectXmlElementList = array();
                    foreach (
                        $explodedOldAtName as $key =>
                        $aspectTemplateUpperNameElement
                    ) {
                        $aspectTemplateNameElement = lcfirst(
                            $aspectTemplateUpperNameElement
                        );
                        if ($aspectTemplateNameElement != $atomicAT) {
                            $aspects
                                = $this->_xmlAt['xml']->
                            {$aspectTemplateNameElement}->children(
                            );
                            foreach ($aspects as $aspect) {
                                $aspectXmlElementList[] = array(
                                    'name'      => (string)$aspect['name'],
                                    'execution' => (string)$aspect['execution']
                                );
                            }
                        } else {
                            unset($explodedOldAtName[$key]);
                        }
                    }
                    $newNotificationAspectTemplate = implode(
                        'And', $explodedOldAtName
                    );
                    if (!$this->_xmlAt['xml']->$newNotificationAspectTemplate) {
                        $xmlAspectTemplate = new SimpleXMLElement(
                            $this->_xmlAt['xml']->asXML()
                        );
                        $aspectTemplateNode = $xmlAspectTemplate->addChild(
                            $newNotificationAspectTemplate
                        );
                        foreach ($aspectXmlElementList as $aspect) {
                            $aspectNode = $aspectTemplateNode->addChild(
                                self::ASPECT_NODE
                            );
                            $aspectNode->addAttribute('name', $aspect['name']);
                            $aspectNode->addAttribute(
                                'execution', $aspect['execution']
                            );
                        }
                        $this->saveXml(
                            $xmlAspectTemplate, $this->_xmlAt['path']
                        );
                    }
                    $action->item(0)->attributes->item(0)->nodeValue
                        = $newNotificationAspectTemplate;
                }
            } else {
                //eliminar el nodo de la acción
                $action->item(0)->parentNode->removeChild($action->item(0));
            }
            $dom->save($this->_xmlW['path']);
        }
    }

    /**
     * __construct
     * Constructor de la clase, inicializa los atributos de la clase.
     */
    public function  __construct()
    {
        parent::ZendExt_Model();
        $xmlRegistry = Zend_Registry::get('config')->xml;
        $this->_xmlN ['path'] = $xmlRegistry->{self::$_xmlS[2]};
        $this->_xmlNe['path'] = $xmlRegistry->{self::$_xmlS[3]};
        $this->_xmlW ['path'] = $xmlRegistry->{self::$_xmlS[0]};
        $this->_xmlAt['path'] = $xmlRegistry->{self::$_xmlS[1]};
        $this->_xmlIoc['path'] = $xmlRegistry->{self::$_xmlS[4]};
        if (isset($_SERVER['PWD'])) {
            $configPath = $_SERVER['PWD'];
            $configPath = explode(DIRECTORY_SEPARATOR, $configPath);
            unset($configPath[count($configPath) - 1]);
            unset($configPath[count($configPath) - 1]);
            $configPath = implode(DIRECTORY_SEPARATOR, $configPath);
            $configPath
                = str_replace('lib', 'apps', $configPath) . DIRECTORY_SEPARATOR
                . $_SERVER['argv'][3];
        } else {
            $configPath = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
        }
        $this->_xmlC['path'] = $configPath . '/comun/recursos/xml/config.xml';
        $this->_xmlN ['xml'] = ZendExt_FastResponse::getXML(self::$_xmlS[2]);
        $this->_xmlNe['xml'] = ZendExt_FastResponse::getXML(self::$_xmlS[3]);
        $this->_xmlW ['xml'] = ZendExt_FastResponse::getXML(self::$_xmlS[0]);
        $this->_xmlAt['xml'] = ZendExt_FastResponse::getXML(self::$_xmlS[1]);
        $this->_xmlIoc['xml'] = ZendExt_FastResponse::getXML(self::$_xmlS[4]);
        if (file_exists($this->_xmlC['path'])) {
            $this->_xmlC['xml'] = simplexml_load_file($this->_xmlC['path']);
        }
        //@TODO excepción
    }

    /**
     * reloadXmlNotification
     * Reinicia los atributos de la clase que contienen el contenido y
     * la ubicación del
     * xml de notificaciones.
     *
     * @throws ZendExt_FastResponse_Exception
     */
    public function reloadXmlNotification()
    {
        $this->_xmlN ['xml'] = @simplexml_load_file($this->_xmlN ['path']);
        if (!$this->_xmlN ['xml'] instanceof SimpleXMLElement) {
            throw new ZendExt_FastResponse_Exception(self::$_xmlS[2], true);
        }
    }

    /**
     * updateXmlWeaver
     * Actualiza el xml del tejedor de aspecto a partir de la ubicación de la
     * acción a partir de la cual se ejecuta el evento.
     *
     * @param $actionDir Dirección de la acción
     *
     * @throws ZendExt_FastResponse_Exception
     */
    public function updateXmlWeaver($actionDir)
    {
        $configObj = Zend_Registry::getInstance()->config;
        $subSystem = explode('/', $configObj->module_reference);
        $xmlWeaverUriArray = explode(
            "/{$subSystem[0]}/", $configObj->xml->{self::$_xmlS[0]}
        );
        $xmlWeaverUri = $xmlWeaverUriArray[count($xmlWeaverUriArray) - 1];

        $applicationDir = Zend_Registry::getInstance()->config->dir_aplication;
        $actionDirArray = explode('-', $actionDir);
        $weaverXmlOfAction
            = $applicationDir . $actionDirArray[0] . '/' . $xmlWeaverUri;

        if (file_exists($weaverXmlOfAction)) {
            $this->_xmlW ['path'] = $weaverXmlOfAction;
            $this->_xmlW ['xml'] = @simplexml_load_file($weaverXmlOfAction);
            if (!$this->_xmlW ['xml'] instanceof SimpleXMLElement) {
                throw new ZendExt_FastResponse_Exception(self::$_xmlS[0], true);
            }
        } else {
            throw new ZendExt_FastResponse_Exception(self::$_xmlS[0], false);
        }
    }

    /**
     * insertarEvento
     * Realiza las operaciones pertinentes con los xmls involucrados en en el
     * componente de notificaciones cuando se crea un nuevo evento.
     *
     * @param string     $nombre  Nombre del evento
     * @param array|null $aspecto Aspecto del evento
     *
     * @return void
     */
    public function insertarEvento($nombre, $aspecto = null)
    {
        if (isset ($aspecto)) {
            $nodes = explode(ComponentSpecModel::SEPARATOR, $aspecto['accion']);

            //buscar en el weaver la referencia de la acción o crearla.
            $this->defineActionIntoWeaver($aspecto['ejecucion'], $nodes);

            //asignarle el evento a la acción correspondiente en el xml
          //  notification
            $this->asignNotificationEvent2Action(
                $nombre, $aspecto['ejecucion'], $nodes
            );
        }
    }

    /**
     * modificarEvento
     * Realiza las operaciones pertinentes con los xmls involucrados en en el
     * componente de notificaciones cuando se modifica un evento.
     *
     * @param int         $idevento    Identificador del evento.
     * @param array $changes Cambios realizados a los atributos
     *                       del evento.
     * @param string|null $currentRef Referencia o ubicación de la acción
     * actual que genera el evento.
     * @param string|null $currentName Nombre actual del evento.
     * @param string|null $currentExec Tipo de ejecución del evento
     * (antes, después o en caso de que falle).
     */
    public function modificarEvento(
        $idevento, $changes, $currentRef = null, $currentName = null,
        $currentExec = null
    )
    {
        $domN = $this->getDomXML($this->_xmlN['path']);
        $domW = $this->getDomXML($this->_xmlW['path']);

        $xpathN = new DOMXPath($domN);
        $xpathW = new DOMXPath($domW);

        if (($changes->oldName || $changes->ejecucion)
            && !$changes->aspectChanged
        ) {
            if (!$changes->oldReference && $currentRef) {
                $nodes = str_replace(
                    ComponentSpecModel::SEPARATOR, DIRECTORY_SEPARATOR,
                    $currentRef
                );
                $queryN = DIRECTORY_SEPARATOR .
                    implode(
                        DIRECTORY_SEPARATOR, array(self :: N_ROOT, $nodes, self :: EVENT_NODE . 's', self :: EVENT_NODE)
                    );
                $queryN .= '[@name="' . ($changes->oldName ? $changes->oldName : $currentName) . '"]';
                $eventN = $xpathN->query($queryN);
                if ($changes->oldName) {
                    $eventN->item(0)->attributes->item(0)->nodeValue
                        = $changes->eventName;
                }
                if ($changes->ejecucion) {
                    $this->updateAspectFromWeaver($nodes, $changes->ejecucion);
                    $eventN->item(0)->attributes->item(1)->nodeValue
                        = $changes->ejecucion;
                }
                $domN->save($this->_xmlN['path']);

                return;
            }
        }

        if ($changes->fromAction && !$changes->aspectChanged) {
            $nodes = str_replace(
                ComponentSpecModel::SEPARATOR, DIRECTORY_SEPARATOR,
                $changes->oldReference
            );
            $queryN = DIRECTORY_SEPARATOR .
                implode(
                    DIRECTORY_SEPARATOR, array(self :: N_ROOT, $nodes, self :: EVENT_NODE . 's', self :: EVENT_NODE)
                ) . '[@name="' . (($changes->eventName) ? $changes->eventName : $currentName) . '"]';
            $queryW = DIRECTORY_SEPARATOR . self :: W_ROOT . DIRECTORY_SEPARATOR
                . $nodes;
            $eventN = $xpathN->query($queryN)->item(0);
            $action = $xpathW->query($queryW)->item(0);
            if ($eventN) {
                $eventN->parentNode->removeChild($eventN);
            }
            if ($action) {
                $action->parentNode->removeChild($action);
            }
            $arrayNodes = explode(
                ComponentSpecModel :: SEPARATOR, $changes->fromAction
            );
            for ($i = 0; $i < count($arrayNodes); $i++) {
                if ($domN->getElementsByTagName($arrayNodes[$i])->length == 0) {
                    $parentTag = ($i > 0) ? $domN->getElementsByTagName($arrayNodes[$i - 1])->item(0)
                        : $domN->getElementsByTagName(self::N_ROOT)->item(0);
                    $elms[] = $domN->createElement($arrayNodes[$i]);
                    $count = 1;
                    for ($j = $i + 1; $j < count($arrayNodes); $j++) {
                        $elms[$count] = $elms[$count - 1]->appendChild($domN->createElement($arrayNodes[$j]));
                        $count++;
                    }
                    $eventsTag = $elms[$count - 1]->appendChild($domN->createElement(self::EVENT_NODE . 's'));
                    $eventTag = $eventsTag->appendChild($domN->createElement(self::EVENT_NODE));
                    $eventTag->setAttribute('name', ($changes->eventName) ? $changes->eventName : $currentName);
                    $eventTag->setAttribute('execution', ($changes->ejecucion) ? $changes->ejecucion : $currentExec);
                    $parentTag->insertBefore($elms[0]);
                    break;
                }
            }
            for ($i = 0; $i < count($arrayNodes); $i++) {
                if ($domW->getElementsByTagName($arrayNodes[$i])->length == 0) {
                    $parentTag = ($i > 0) ? $domW->getElementsByTagName($arrayNodes[$i - 1])->item(0)
                        : $domW->getElementsByTagName(self::W_ROOT)->item(0);
                    $elms[] = $domW->createElement($arrayNodes[$i]);
                    $count = 1;
                    for ($j = $i + 1; $j < count($arrayNodes); $j++) {
                        $elms[$count] = $elms[$count - 1]->appendChild($domW->createElement($arrayNodes[$j]));
                        $count++;
                    }
                    $elms[$count - 1]->setAttribute(
                        'aspecttemplate', $this->getAtomicAT(($changes->ejecucion) ? $changes->ejecucion : $currentExec)
                    );
                    $parentTag->insertBefore($elms[0]);
                    break;
                }
            }
            $domW->save($this->_xmlW['path']);
            $domN->save($this->_xmlN['path']);
        }

        if ($changes->aspectChanged) {
            if ($changes->oldReference
                && $changes->oldExecution
            ) { //tenía aspecto configurado y ya no tiene
                $nodes = str_replace(
                    ComponentSpecModel::SEPARATOR, DIRECTORY_SEPARATOR,
                    $changes->oldReference
                );
                $this->deleteEventFromN(
                    ($changes->oldName) ? $changes->oldName : $currentName, $nodes,
                    ($changes->oldExecution) ? $changes->oldExecution : $currentExec
                );
                $this->updateAspectFromWeaver($nodes, $changes->ejecucion);
            } else { //no tenía aspecto configurado y ahora tiene
                $aspecto['accion'] = $changes->fromAction;
                $aspecto['ejecucion'] = $changes->ejecucion;
                $this->insertarEvento(
                    ($changes->oldName) ? $changes->oldName : $currentName,
                    $idevento, $aspecto
                );
            }
        }
    }

    /**
     * eliminarEvento
     * Realiza las operaciones pertinentes con los xmls involucrados en en el
     * componente de notificaciones cuando se elminina un evento.
     *
     * @param string $nombre    Nombre del evento
     * @param string $reference Referencia de la acción que ejecuta el evento.
     */
    public function eliminarEvento($nombre, $reference = '')
    {
        if ($reference) {
            //buscar y eliminar el evento en notification.xml
            $nodes = str_replace(
                ComponentSpecModel::SEPARATOR, DIRECTORY_SEPARATOR, $reference
            );
            $execution = $this->deleteEventFromN($nombre, $nodes);
            //cambiar la especificación del aspecttemplate de la acción en el
            //weaver
            $this->updateAspectFromWeaver($nodes, $execution);
        }
    }

    /**
     *  buildNotificatorNode
     *  Crea un nodo de notificación con sus respectivos atributos
     *  según la especificación
     *
     * @param array $spec Especificación del evento
     *
     * @return SimpleXmlElement
     */
    private function buildNotificationNode($spec)
    {
        list($id, $active, $cmp, $func) = $spec;
        $xmlNode = '<notification></notification>';
        $xml = new SimpleXmlElement($xmlNode);
        $xml->addAttribute('id', $id);
        $xml->addAttribute('active', $active);
        if ($cmp && $func) {
            $command = $xml->addChild('command');
            $command->addAttribute('component', $cmp);
            $command->addAttribute('service', $func);
        }

        return $xml;
    }

    /**
     * isAspected
     * Indica si un evento es aspectado (está vinculado a una
     * acción determinada)
     * o no.
     *
     * @param int $eventid Identificador del evento.
     *
     * @return boolean
     */
    public function isAspected($eventid)
    {
        $ne = new SimpleXmlElement($this->_xmlNe['xml']->asXML());
        $query = DIRECTORY_SEPARATOR .
            self :: NE_ROOT .
            DIRECTORY_SEPARATOR .
            self :: EVENT_NODE . '[@id="' . $eventid . '"]';
        $event = $ne->xpath($query);

        return NotificacionesUtil:: toStrictBoolean(
            (string)$event[0]->attributes()->aspected
        );
    }

    /**
     * getEventExecution
     * Obtiene el momento en que se ejecuta un evento a partir de la
     * ubicación de una acción.
     *
     * @param string $nombre
     * @param string $reference
     *
     * @return null|string
     */
    public function getEventExecution($nombre = '', $reference = '')
    {
        if ($reference && $nombre) {
            $nodes = str_replace(
                ComponentSpecModel::SEPARATOR, DIRECTORY_SEPARATOR, $reference
            );
            $nodes .= DIRECTORY_SEPARATOR . self::EVENT_NODE . 's'
                . DIRECTORY_SEPARATOR . self::EVENT_NODE;
            $query = DIRECTORY_SEPARATOR .
                self :: N_ROOT .
                DIRECTORY_SEPARATOR .
                $nodes . '[@name="' . $nombre . '"]';
            $simplexml = new SimpleXmlElement($this->_xmlN['xml']->asXML());
            $evento = $simplexml->xpath($query);
            if (is_array($evento) && $evento[0] instanceof SimpleXMLElement) {
                return (string)$evento[0]->attributes()->execution;
            }

            return null;
        }

        return null;
    }

    /**
     *  insertarAviso
     *  Realiza las operaciones pertinentes con los xmls involucrados en en el
     *  componente de notificaciones cuando se inserta un aviso.
     *
     * @param string $idNotif     Identificador del aviso
     * @param string $eventName   Nombre del evento
     * @param string $nfReference Referencia de la función notificadora
     *
     * @return void
     */
    /**
     * insertarAviso
     * Realiza las operaciones pertinentes con los xmls involucrados en en el
     * componente de notificaciones cuando se inserta un aviso.
     *
     * @param int    $idNotif     Identificador del aviso o notificación.
     * @param string $eventName   Nombre del evento.
     * @param bool   $active      Define si la notificación está activa.
     * @param string $nfReference Ubicación de la acción que genera el evento.
     *
     * @throws ZendExt_Exception
     */
    public function insertarAviso(
        $idNotif, $eventName, $active = true, $nfReference = ''
    )
    {
        list($nfCmp, $nfFunc) = explode(
            ComponentSpecModel::SEPARATOR, $nfReference
        );
        $ne = new SimpleXMLElement($this->_xmlNe['xml']->asXML());
        $path
            = DIRECTORY_SEPARATOR . self :: NE_ROOT . DIRECTORY_SEPARATOR
            . self :: EVENT_NODE . '[@name="' . $eventName
            . '"]';
        $event = $ne->xpath($path);
        if ($event[0]) {
            $notifications = $event[0]->notifications;
            if (!$notifications) {
                $notifications = $event[0]->addChild(self :: N_ROOT . 's');
            }
            $notification = $this->buildNotificationNode(
                array($idNotif, $active ? 'true' : 'false', $nfCmp, $nfFunc)
            );
            $this->simplexmlAppend($notifications, $notification);
            $this->saveXml($ne, $this->_xmlNe['path']);
        } else {
            //@TODO 
            throw new ZendExt_Exception('');
        }
    }

    /**
     * eliminarAviso
     * Realiza las operaciones pertinentes en el xml de notificaciones de
     * evento (notificationevents.xml)
     * cuando se elimina un aviso.
     *
     * @param string $idevento Identificador del evento
     * @param string $idaviso  identificadior del aviso
     */
    public function eliminarAviso($idevento, $idaviso)
    {
        $domNE = $this->getDomXML($this->_xmlNe['path']);
        $query = DIRECTORY_SEPARATOR .
            implode(
                DIRECTORY_SEPARATOR,
                array(self::NE_ROOT, self::EVENT_NODE . '[@id="' . $idevento . '"]', self::N_ROOT . 's',
                      self::N_ROOT . '[@id="' . $idaviso . '"]')
            );
        $xpath = new DOMXPath($domNE);
        $aviso = $xpath->query($query)->item(0);
        if ($aviso) {
            $aviso->parentNode->removeChild($aviso);
        }
        $domNE->save($this->_xmlNe['path']);
    }

    /**
     * getDomXML
     * Obtiene el contenido de un xml en un objeto DOM.
     *
     * @param string  $xmlPath       Ubicación del xml.
     * @param boolean $humanReadable Define si el xml debe ser formateado.
     *
     * @return DOMDocument
     */
    private function getDomXML($xmlPath, $humanReadable = true)
    {
        $doc = new DOMDocument();
        if ($humanReadable) {
            $doc->preserveWhiteSpace = false;
            $doc->formatOutput = true;
        }
        $doc->load($xmlPath);

        return $doc;
    }

    /**
     * formatXml
     * Convierte un xml en "human-readable".
     *
     * @param string           $xmlPath Ubicación del xml.
     * @param null|DOMDocument $doc     Contenido del xml.
     */
    private static function formatXml($xmlPath, $doc = null)
    {
        if ($doc === null) {
            $doc = new DOMDocument();
        }
        $doc->preserveWhiteSpace = false;
        $doc->formatOutput = true;
        $doc->load($xmlPath);
        $doc->save($xmlPath);
    }

    /**
     * saveXml
     * Salva los cambios en un xml
     * y opcionalmente convierte al xml en "human-readable".
     *
     * @param SimpleXmlElement $xml
     * @param string           $xmlPath
     * @param boolean          $humanReadable
     */
    private static function saveXml($xml, $xmlPath, $humanReadable = true)
    {
        $xml->asXML($xmlPath);
        if ($humanReadable) {
            self::formatXml($xmlPath);
        }
    }

    /**
     * getNotificationsInfoByEvent
     * Obtiene los avisos (o notificaciones) a enviar dado un evento.
     *
     * @param string $eventName Nombre del evento
     *
     * @return array
     */
    public function getNotificationsInfoByEvent($eventName)
    {
        $query = DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, array(self :: NE_ROOT, self :: EVENT_NODE));
        $query .= '[@name="' . $eventName . '"]';
        $event = $this->_xmlNe['xml']->xpath($query);
        $notificationsInfo = array();
        $notifications = $event[0]->notifications;
        foreach ($notifications->notification as $notification) {
            if (NotificacionesUtil:: toStrictBoolean(
                (string)$notification->attributes()->active
            )
            ) {
                $notificationInfo ['id'] = (string)$notification->attributes(
                )->id;
                if ($notification->command) {
                    $notificationCommand = $notification->command->attributes();
                    if ((string)$notificationCommand->component != ''
                        && (string)$notificationCommand->service != ''
                    ) {
                        $notificationInfo['commandReference']
                            = array((string)$notificationCommand->component,
                                    (string)$notificationCommand->service);
                    }
                }
                $notificationsInfo[] = $notificationInfo;
            }
        }

        return $notificationsInfo;
    }

    /**
     * showIoCServices
     * Devuelve los servicios del sistema que implementa la acción que
     * ejecuta el evento.
     *
     * @param string $node    Ubicación de la acción que genera el evento.
     * @param bool   $fromCmp Si el evento es generado por una acción.
     *
     * @return array
     */
    public function showIoCServices($node, $fromCmp)
    {
        $domIoC = $this->getDomXML($this->_xmlIoc['path']);
        $xpathIoC = new DOMXPath($domIoC);
        $queryIoC = DIRECTORY_SEPARATOR . self :: IoC_ROOT;
        $services = array();
        $count = 0;
        $_iocNodePath = $node . '/comun/recursos/xml/ioc.xml';
        $queryIoC .= DIRECTORY_SEPARATOR . '*[@src="' .
            str_replace(ComponentSpecModel::SEPARATOR, DIRECTORY_SEPARATOR, $_iocNodePath) . '"]';
        $cmp = $xpathIoC->query($queryIoC)->item(0);
        if ($cmp) {
            $_xmlIocPath = Zend_Registry::getInstance()->config->dir_aplication
                . $cmp->getAttribute('src');
            $domIoC = $this->getDomXML($_xmlIocPath);
            $xpathIoC = new DOMXPath($domIoC);
            $queryIoC = DIRECTORY_SEPARATOR . self :: IoC_ROOT;
            if ($node != '0') {
                $queryIoC .= DIRECTORY_SEPARATOR . '*[@src="' .
                    str_replace(ComponentSpecModel::SEPARATOR, DIRECTORY_SEPARATOR, $node) . '"]';
                $cmp = $xpathIoC->query($queryIoC)->item(0);
                if ($cmp) {
                    foreach ($cmp->childNodes as $child) {
                        if (!($child instanceof DOMComment)) {
                            $services[$count]  ['id'] = !$fromCmp
                                ? $child->nodeName
                                : ($cmp->nodeName
                                    . ComponentSpecModel::SEPARATOR
                                    . $child->nodeName);
                            $services[$count++]['text'] = !$fromCmp
                                ? $child->nodeName
                                : ('[' . $cmp->nodeName . '] '
                                    . $child->nodeName);
                        }
                    }
                }
            } else {
                foreach (
                    $domIoC->getElementsByTagName(self::IoC_ROOT)->item(
                        0
                    )->childNodes as $child
                ) {
                    if (!($child instanceof DOMComment)) {
                        $services[$count]  ['id'] = str_replace(
                            DIRECTORY_SEPARATOR,
                            ComponentSpecModel :: SEPARATOR,
                            $child->getAttribute('src')
                        );
                        $services[$count++]['text'] = $child->nodeName;
                    }
                }
            }
        }

        return ComponentSpecModel:: applyConfig($services, $node != '0');
    }

    /**
     * getValidationCommand
     * Obtiene el comando de validación de una notificación de evento.
     *
     * @param $idevento Identificador del evento.
     * @param $idaviso  Identificador del aviso.
     *
     * @return array|null
     */
    public function getValidationCommand($idevento, $idaviso)
    {
        $query = DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, array(self::NE_ROOT, self::EVENT_NODE));
        $query = implode(
            DIRECTORY_SEPARATOR,
            array($query . '[@id="' . $idevento . '"]', self::N_ROOT . 's',
                  self::N_ROOT . '[@id="' . $idaviso . '"]')
        );
        $notif = $this->notificationevents->xml->xpath($query);
        if (!$notif[0]->command) {
            return null;
        }

        return array_values((array)$notif[0]->command->attributes());
    }

    /**
     * activarDesactivarAviso
     * Activa o desactiva una notificación.
     *
     * @param $idaviso Identificador del aviso.
     */
    public function activarDesactivarAviso($idaviso)
    {
        $ne = new SimpleXMLElement($this->_xmlNe['xml']->asXML());
        $query = DIRECTORY_SEPARATOR .
            implode(
                DIRECTORY_SEPARATOR,
                array(self::NE_ROOT, self::EVENT_NODE, self::N_ROOT . 's', self::N_ROOT . '[@id="' . $idaviso . '"]')
            );
        $notif = $ne->xpath($query);
        $notif[0]->attributes()->active = NotificacionesUtil:: toStrictBoolean(
            $notif[0]->attributes()->active
        )
            ? 'false' : 'true';
        $this->saveXml($ne, $this->notificationevents->path);
    }
}
