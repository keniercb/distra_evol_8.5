<?php

/**
 * DatConvenios
 *
 * @author Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @copyright UCID
 * @version 1.0
 */
class HisConvenios extends BaseHisConvenios {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */

    public static function guardarDatosHisConvenios($idnomtipodestajo, $identidad, $fechainicio, $fechafin)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $obtenerdatosconvenio = "SELECT * FROM mod_nomina.dat_convenios WHERE identidad = $identidad AND idnomtipodestajo = $idnomtipodestajo;";
        $datos = $conn->fetchAll($obtenerdatosconvenio);

        foreach ($datos as $key => $value) {
            $objHisConvenio = new HisConvenios();
            $objHisConvenio->denominacion = $value['denominacion'];
            $objHisConvenio->obra = $value['obra'];
            $objHisConvenio->importe = $value['importe'];
            $objHisConvenio->fechainicio = $value['fechainicio'];
            $objHisConvenio->fechafin = $value['fechafin'];
            $objHisConvenio->descripcion = $value['descripcion'];
            $objHisConvenio->idplantillanominal = $value['idplantillanominal'];
            $objHisConvenio->periodo = $fechainicio . ' al ' . $fechafin;
            $objHisConvenio->idnomtipodestajo = $value['idnomtipodestajo'];
            $objHisConvenio->save();
        }
        return true;
        
    }

    public static function obtenerListadoConveniosPeriodoHistorico($idnomtipodestajo, $periodo) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT hc.*, cpn.denominacion as brigada 
            FROM mod_nomina.his_convenios hc 
            LEFT JOIN mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = hc.idplantillanominal)
            WHERE idnomtipodestajo = $idnomtipodestajo AND periodo = '$periodo' ORDER BY idplantillanominal ASC;";
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public static function obtenerListadoConveniosHistorico($inicio, $limite, $idplantilla, $idnomtipodestajo, $identidad, $periodo) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT * FROM mod_nomina.his_convenios WHERE idplantillanominal = $idplantilla AND periodo = '$periodo' AND idnomtipodestajo = $idnomtipodestajo;";
        $arrayreturn = $conn->fetchAll($sql);

        $sumaPorObra = [];

        foreach ($arrayreturn as $convenio) {
            $obra = $convenio['obra'];
            $importe = $convenio['importe'];
            
            if (isset($sumaPorObra[$obra])) {
                $sumaPorObra[$obra] += $importe;
            } else {
                $sumaPorObra[$obra] = $importe;
            }
        }

        // Paso 2: Asignar el valor de sumaxobra a cada elemento según su obra
        foreach ($arrayreturn as &$convenio) {
            $obra = $convenio['obra'];
            $convenio['sumaxobra'] = $sumaPorObra[$obra];
            $convenio['obra'] = $convenio['obra'] . '-$' . number_format(floatval($sumaPorObra[$obra]), 2);
        }

        return $arrayreturn;
    }

    public static function obtenerVariablesPeriodoHis($idplantilla, $idnomtipodestajo, $identidad, $periodo) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT  datos FROM mod_nomina.dat_variablespagodestajo WHERE idnomtipodestajo = $idnomtipodestajo AND identidad = $identidad AND periodo = '$periodo';";
        $datos = $conn->fetchOne($sql);

        $datos = unserialize($datos);
        $arrayfinal = array();
        $cont = 0;
        foreach ($datos as $i => $value) {
            if ($value['idplantillanominal'] == $idplantilla) {
                $arrayfinal[$cont]['montobrigada'] = $value['montobrigada'];
                $arrayfinal[$cont]['coeficiente'] = $value['coeficiente'];
                $arrayfinal[$cont]['salariocalculado'] = $value['salariocalculado'];
                $arrayfinal[$cont]['idplantillanominal'] = $value['idplantillanominal'];
                $cont++;
            }
        }

        return $arrayfinal;
    }

    
    
}
