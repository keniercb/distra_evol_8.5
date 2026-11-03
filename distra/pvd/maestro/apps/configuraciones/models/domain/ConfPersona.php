<?php

/**
 * @name ConfRegistrounico - Clase del dominio para la configuracion de las personas con derecho a elaborar o aprobar .
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfPersona extends BaseConfPersona//conf_firma
{
    public function setUp()
    {
        parent:: setUp();
    }

  public function getFirma()
    {
        $query = new Doctrine_Query();
        $result = $query ->from('ConfPersona r');
        return $result->fetchArray();
    }

    public function updConf($idfirma,$idepersona, $aprueba, $elabora){
        if ($elabora == 'true') {
            $elabo = 1;
        } else {
            $elabo = 0;
        }
        if ($aprueba == 'true') {
            $apr = 1;
        } else {
            $apr = 0;
        }
        try {
        $query = Doctrine_Query::create()
            ->update('ConfPersona')
            ->set('idpersona', '?', $idepersona)
            ->set('elabora', '?', $elabo)
            ->set('aprueba', '?', $apr)
            ->where("idfirma=" . $idfirma);
        $result = $query->fetchArray();
            if ($result) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }



}