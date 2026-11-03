<?php

class PortalProxyService
{

    public function ObtenerSubsitemaURI($uri)
    {
        $xmlSubsistemas = ZendExt_FastResponse::getXML('subsistemas');
        if (isset($xmlSubsistemas->{$uri->nivel3}) && $xmlSubsistemas->{$uri->nivel3}['idsubsistema']
        ) {
            $standard = $this->xmlSubsistemaToStdClass(
                $xmlSubsistemas->{$uri->nivel3}
            );
        } elseif (isset($xmlSubsistemas->{$uri->nivel1}) && $xmlSubsistemas->{$uri->nivel1}['idsubsistema']
        ) {
            $standard = $this->xmlSubsistemaToStdClass(
                $xmlSubsistemas->{$uri->nivel1}
            );
        } else {
            $standard = new stdClass();
        }

        return $standard;
    }

    public function ObtenerSubsitemaURIByUri($uri)
    {
        $register = Zend_Registry::getInstance();
        $standard = array();
        $dirXML = $register->config->xml->subsistemas;
        $xmlSubsistemas = new SimpleXMLElement($dirXML, null, true);
        $subsistemas = $xmlSubsistemas->children();
        foreach ($subsistemas as $children) {
            if ((string)$children->attributes()->uri == $uri) {
                $standard = self::xmlToArray($children);
                break;
            }
        }

        return $standard;
    }

    public function ObtenerSubsistemasall()
    {
        $register = Zend_Registry::getInstance();
        $dirXML = $register->config->xml->subsistemas;
        $xmlSubsistemas = new SimpleXMLElement($dirXML, null, true);
        $subsistemas = $xmlSubsistemas->children();
        $standard = array();
        if (count($subsistemas) > 0) {
            foreach ($subsistemas as $children) {
                $standard[] = self::xmlToArray($children);
            }
        }

        return $standard;
    }

    public function BuscarSubsistemaPorId($identificador)
    {
        $register = Zend_Registry::getInstance();
        $standard = array();
        $dirXML = $register->config->xml->subsistemas;
        $xmlSubsistemas = new SimpleXMLElement($dirXML, null, true);
        $subsistemas = $xmlSubsistemas->children();
        foreach ($subsistemas as $children) {
            if ((int)$children->attributes()->idsubsistema == $identificador) {
                $standard = self::xmlToArray($children);
                break;
            }
        }

        return $standard;
    }

    public function ObtenerSubsistemas($start, $limit)
    {
        $register = Zend_Registry::getInstance();
        $dirXML = $register->config->xml->subsistemas;
        $xmlSubsistemas = new SimpleXMLElement($dirXML, null, true);
        $subsistemas = $xmlSubsistemas->children();
        $standard = array();
        if (count($subsistemas) > 0) {
            foreach ($subsistemas as $children) {
                $standard[] = self::xmlToArray($children);
            }
        }

        return array(
            'datos' => array_splice($standard, $start, $limit),
            'cantidad' => count($subsistemas)
        );
    }

    protected function xmlSubsistemaToStdClass($xmlSubsistema)
    {
        $standard = new stdClass();
        $standard->idsubsistema = (int)$xmlSubsistema['idsubsistema'];
        $standard->uri = (string)$xmlSubsistema['uri'];
        //cambiando nombre de atributo para que tenga corespondencia con el ERP
        //$standard->denomsubsistema = (string)$xmlSubsistema['denomsubsistema'];
        $standard->denominacion = (string)$xmlSubsistema['denomsubsistema'];
        $standard->idestado = 0;
        $standard->estado = '';
        $standard->version = 0;
        $standard->crc = 0;

        return $standard;
    }

    private function xmlToArray($children)
    {
        return array(
            'idsubsistema' => (int)$children->attributes()->idsubsistema,
            'uri' => (string)$children->attributes()->uri,
            'denominacion' => (string)$children->attributes()->denomsubsistema
        );
    }
}