<?php

/**
 * Interfaz o Proxy utilizado por Quarseg para brindar los servicios de
 * consulta y manipulación de los xml.
 *
 * @package   Quarseg
 * @copyright XETID.
 * @author    Equipo de desarrollo Zeolides.
 * @version   3.0
 */
class SeguridadServiceXml
{
    /* Modificar el comentario de los metodos */

    /**
     * - Retorna un listado de los
     * subsistemas registrado en el marco de trabajo.
     * @method getDateSubsystem()
     * @param - Ninguno
     * @return ARRAY - Listado de Subsistemas.
     */
    public function getDateSubsystem()
    {
        $dirxmlsubsystem = dirname(__FILE__) 
            . '/../../comun/recursos/xml/subsistemas.xml';
        $subSistemas = simplexml_load_file($dirxmlsubsystem);
        $tmp = array();
        foreach ($subSistemas as $value) {
            $tmp[] = array(
                'id' => (string) $value['idsubsistema'],
                'uri' => (string) $value['uri'],
                'denominacion' => (string) $value['denomsubsistema'],
                'nombre' => (string) $value['nombre']
            );
        }
        return $tmp;
    }
    /**
     * - Retorna la uri de un
     * subsistema registrado en el marco de trabajo
     * dado su identificador.
     * @method getDateSubsystem()
     * @param NUMERIC - Identificador del subsistema.
     * @return STRING - Uri del subsistema.
     */
    public function getUriSubsystemById($id)
    {

        $subSistemas = $this->getDateSubsystem();
        foreach ($subSistemas as $value) {
            if ($value['id'] == $id) {
                return $value['uri'];
            }
        }
        return "";
    }

    /**
     * - Retorna el subsistema que
     * esta asociado a la uri.
     * @method getSubsystemByUri($uri)
     * @param  STRING  - La uri del subsistema.
     * @return STRING -Nombre del subsistema o false.
     */
    public function getSubsystemByUri($uri)
    {
        $subSistemas = $this->getDateSubsystem();
        foreach ($subSistemas as $value) {
            if ($value['uri'] == $uri) {
                return $value['denominacion'];
            }
        }
        return false;
    }

    /**
     * - Escribir los datos del subsistema en el fichero
     * subsistemas.xml.
     * @method writeSusbsystemSubsistemasXml($id,$namesubsystem,$uri,$denominacion)
     * @param  NUMERIC - Identificador del subsistema.
     * @param STRING - Nombre del subsistema.
     * @param STRING - Uri del subsistema.
     * @param STRING - Denominación.
     * @return BOOLEAN - Retorna true en caso de escritura satisfactoria,
     * false en otro caso.
     */
    public function writeSusbsystemSubsistemasXml(
        $id, $namesubsystem, $uri, $denominacion
    )
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $diraplicaciones = $dirApps . 'comun/recursos/xml/subsistemas.xml';
        if (!$this->existsubsistama($namesubsystem)) {
            $xml = simplexml_load_file($diraplicaciones);
            $obj = $xml->addChild($namesubsystem);
            $obj->addAttribute("idsubsistema", $id);
            $obj->addAttribute("denomsubsistema", $denominacion);
            $obj->addAttribute("uri", $uri);
            $obj->addAttribute("nombre", $namesubsystem);
            $xml->saveXML($diraplicaciones);
            return true;
        }
        return false;
    }

    /**
     * - Servicio para comprobar que exista un
     * subsistema dado su nombre.
     * @param STRING - Nombre del subsistema.
     * @return BOOLEAN - Retorna true en caso de existir,
     * false en otro caso.
     */
    public function existsubsistama($namesubsystem)
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $diraplicaciones = $dirApps . 'comun/recursos/xml/subsistemas.xml';
        $xml = simplexml_load_file($diraplicaciones);
        foreach ($xml as $line) {
            if ($line['nombre'] == (string) $namesubsystem) {
                return true;
            }
        }
        return false;
    }

    /**
     * - Remover los datos del subsistema el en
     * fichero subsistemas.xml
     * @method removingSusbsystemSubsistemasXml($idsistema)
     *
     * @param  NUMERIC - Identificador del subsistema.
     * @return BOOLEAN - Retorna true en caso de sere removido satisfactoriamente,
     * false en otro caso.
     */
    public function removingSusbsystemSubsistemasXml($idsistema)
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $diraplicaciones = $dirApps . 'comun/recursos/xml/subsistemas.xml';
        $xml = simplexml_load_file($diraplicaciones);
        $result = false;
        foreach ($xml as $key => $line) {
            if ($line['idsubsistema'] == (string) $idsistema) {
                unset($xml->$key);
                $result = true;
                break;
            }
        }
        $xml->saveXML($diraplicaciones);
        return $result;
    }

    /**
     * - Modificar los datos de un subsitema en el fichero
     * subsistemas.xml.
     * @param NUMERIC - Identificador del subsitema.
     * @param STRING - Nombre del subsistema.
     * @param STRING - Uri del subsistema.
     * @param STRING - Denominación del subsistema.
     * @return MIXED - Retorna los datos del subsistema modificado
     * en caso de ser modificado satisfactoriamente,
     * false en otro caso.
     */
    public function modificarSubsistema(
        $id, $namesubsystem, $uri, $denominacion
    )
    {
        if ($this->existsubsistama($namesubsystem)) {
            $this->removingSusbsystemSubsistemasXml($id);
            $result = $this->writeSusbsystemSubsistemasXml(
                $id, $namesubsystem, $uri, $denominacion
            );
            return $result;
        }
        return false;
    }

}
