<?php

/**
 * Modelo de negocio para gestionar el snc 225.
 *
 * @author Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Modelo de negocio
 * @uses ConfigRegistroSalarioTiempoServicioModel
 * @copyright UCID
 * @version 1.0
 */
class ConfigRegistroSalarioTiempoServicioModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function ConfigRegistroSalarioTiempoServicioModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoCamposRegistroSalario($idtiponomina)
    {
        $ioc = ZendExt_IoC_Inter::getInstance();
        $arrayfinal = array();
        $contarrayfinal = 0;
        $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicio();
        $arrayconf = $objConfRegistroSalario->obtenerListadoCamposRegistroSalario($idtiponomina);
        foreach ($arrayconf as $i => $rconf) {
            $arrayfinal[$contarrayfinal]['idregistsalartiempservc'] = $rconf['idregistsalartiempservc'];
            $arrayfinal[$contarrayfinal]['idtiponomina'] = $rconf['idtiponomina'];

            $arrayfinal[$contarrayfinal]['expresionmatemdias'] = $rconf['expresionmatemdias'];
            if ($rconf['expresionmatemdias']) {
                $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($rconf['expresionmatemdias']));
                $arrayfinal[$contarrayfinal]['textoexpresionmatemdias'] = $rf[0]['expresionamostrar'];
            }

            $arrayfinal[$contarrayfinal]['expresionmatemimport'] = $rconf['expresionmatemimport'];
            if ($rconf['expresionmatemimport']) {
                $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($rconf['expresionmatemimport']));
                $arrayfinal[$contarrayfinal]['textoexpresionmatemimporte'] = $rf[0]['expresionamostrar'];
            }

            $arrayfinal[$contarrayfinal]['expresionmatemimportdevengado'] = $rconf['expresionmatemimportdevengado'];
            if ($rconf['expresionmatemimportdevengado']) {
                $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($rconf['expresionmatemimportdevengado']));
                $arrayfinal[$contarrayfinal]['textoexpresionmatemimportedev'] = $rf[0]['expresionamostrar'];
            }

            $arrayfinal[$contarrayfinal]['denominacion'] = $rconf['denominacion'];
            $contarrayfinal++;
        }
        return $arrayfinal;
    }

    public function adicionarvariablessnc($idtiponomina, $denominacion)
    {
        $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicio();
        $objConfRegistroSalario->idtiponomina = $idtiponomina;
        $objConfRegistroSalario->denominacion = $denominacion;
        $objConfRegistroSalario->save();
        return 'ok';
    }

    public function modificarvariablessnc($idregistsalartiempservc,$idtiponomina, $denominacion)
    {
        $obj = new ConfigRegistroSalarioTiempoServicio();
        $objConfRegistroSalario = $obj->obtenerObjConfigRegistroSalarioTiempoServicio($idregistsalartiempservc);
        $objConfRegistroSalario->idtiponomina = $idtiponomina;
        $objConfRegistroSalario->denominacion = $denominacion;
        $objConfRegistroSalario->save();
        return 'ok';
    }

    public function adicionarformulas($idregistsalartiempservc, $idexpresionmatematica, $tipoexpresion)
    {
        $objConfRegistroSalario = ConfigRegistroSalarioTiempoServicio::obtenerObjConfigRegistroSalarioTiempoServicio($idregistsalartiempservc);
        if ($tipoexpresion == 1) {
            $objConfRegistroSalario->expresionmatemdias = $idexpresionmatematica;
        } else if ($tipoexpresion == 2) {
            $objConfRegistroSalario->expresionmatemimport = $idexpresionmatematica;
        } else {
            $objConfRegistroSalario->expresionmatemimportdevengado = $idexpresionmatematica;
        }
        $objConfRegistroSalario->save();
        return 'ok';
    }

    public function eliminarvariablessnc($idregistsalartiempservc)
    {
        //Consulta para saber si la variable se está utilizando en la tabla "dat_registrosalariotiemposervcio"
        $sql = "select * from mod_nomina.dat_registrosalariotiemposervcio where idconfregistsalartiempservc = ? ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrDatRSTS = $conn->fetchAll($sql, array($idregistsalartiempservc));
        if (count($arrDatRSTS) > 0) {
            $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicio();
            $denominacion = $objConfRegistroSalario->obtenerDenominacioDadoIdConf($idregistsalartiempservc);
            return $denominacion;
        } else {
            $objDelete = ConfigRegistroSalarioTiempoServicio::obtenerObjConfigRegistroSalarioTiempoServicio($idregistsalartiempservc);
            $objDelete->delete();
            return 'ok';
        }
    }

}