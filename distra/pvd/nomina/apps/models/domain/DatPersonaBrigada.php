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
class DatPersonaBrigada extends BaseDatPersonaBrigada {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */

    public static function obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT DISTINCT(dpb.idpersona), dpb.*, dpb.idplantillanominal, dp.nombre, dp.snombre, dp.papel, dp.sapel, doc.numero as numid, cpn.denominacion, nfe.ordenunico, dco.idcargo,
                cpn.orden
                FROM mod_nomina.dat_personabrigada dpb
                
                INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dpb.idpersona)  
                left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)  
                LEFT JOIN mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = dpb.idplantillanominal)  
                INNER JOIN mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idplantillanominal = cpn.idplantillanominal)
                INNER JOIN mod_nomina.dat_cargosocupados dco on (dco.idpersona = dpb.idpersona)
                INNER JOIN mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dco.idcargo) ";
        if ($idplantilla) {
           $sql .= " WHERE dpb.idplantillanominal = $idplantilla";
        }
        $orden = " ORDER BY cpn.orden ASC";
        $sql .= $orden;
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public static function obtenerListadoPersonasBrigadaHistorico($inicio = 0, $limite = 10, $idplantilla, $identidad, $periodo, $idnomtipodestajo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT datos FROM mod_nomina.dat_pagodestajo WHERE idnomtipodestajo = $idnomtipodestajo AND periodo = '$periodo' AND identidad = $identidad;";
        $datos = $conn->fetchOne($sql);

        $r = unserialize($datos);

        return $r; 

    }

    public static function adicionarPersonasByBrigada($arrayidpersonas, $idplantilla, $identidad)
    {
        $respuesta = new stdClass();
        $mensaje = array();

        foreach ($arrayidpersonas as $i => $datos) {
            $idpersona = $datos[0];
            $idcargo = $datos[1];

            $existe = self::existePersonaBrigada($idpersona, $idplantilla, $identidad);
            $estaenplantilla = self::existePersonaEnPlantilla($idpersona, $identidad);
            if (!$existe) {
                $plantillaNominal = self::existePersonaOtraBrigada($idpersona, $identidad);
                if ($idplantilla != $plantillaNominal && $plantillaNominal != 0) {
                    $sql = "UPDATE 
                        mod_nomina.dat_personabrigada 
                        SET 
                        idplantillanominal = $idplantilla
                        WHERE idpersona = $idpersona;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $conn->execute($sql); 
                    
                }else {
                    $sql = "INSERT INTO mod_nomina.dat_personabrigada
                        (
                            idpersona,
                            idplantillanominal,
                            identidad,
                            idcargo
                        ) VALUES (
                            $idpersona,
                            $idplantilla,
                            $identidad,
                            $idcargo
                        );";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $conn->execute($sql); 
                }

            } else {
                
                $mensaje[] = self::obtenerNombrePersonaById($idpersona);
                
            } 
        }

        if (!$mensaje) {
            $respuesta->codigo = 1;
        } else {
            $respuesta->codigo = 3;
            $respuesta->mensaje = $mensaje;
        }

        return $respuesta;       
        
    }

    public static function eliminarPersonasByBrigada($arrayidpersonabrigada)
    {
        $respuesta = new stdClass();

        foreach ($arrayidpersonabrigada as $key => $idpersonabrigada) {

            $obj = Doctrine::getTable('DatPersonaBrigada')->find($idpersonabrigada);
            $obj->delete();
        }
        $respuesta->codigo = 1;

        return $respuesta;
    }

    public static function existePersonaBrigada($idpersona, $idplantilla, $identidad) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT  count(idpersona)
                FROM mod_nomina.dat_personabrigada where idpersona = $idpersona and idplantillanominal = $idplantilla AND identidad = $identidad;";
        $datos = $conn->fetchOne($sql);
        return $datos;
    }

    public static function existePersonaEnPlantilla($idpersona,  $identidad) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT  count(idpersona)
                FROM mod_nomina.dat_personabrigada where idpersona = $idpersona AND identidad = $identidad;";
        $datos = $conn->fetchOne($sql);
        return $datos;
    }

    public static function existePersonaOtraBrigada($idpersona, $identidad) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT  idplantillanominal
                FROM mod_nomina.dat_personabrigada where idpersona = $idpersona AND identidad = $identidad;";
        $datos = $conn->fetchOne($sql);
        return $datos;
    }

    public static function obtenerNombrePersonaById($idpersona) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT replace(concat(trim(nombre),' ',trim(snombre), ' ',trim(papel), ' ',trim(sapel)),'  ',' ') as nombreyapellidos
            FROM  mod_persona.dat_persona where idpersona = $idpersona;";
        $datos = $conn->fetchOne($sql);
        return $datos;
    }
     
    public static function obtenerDatosElementodAosiadosalCargo($idplantilla, $identidad) 
    {
        $arraypersonas = array();
        $cont = 0;

        $datospersonas = self::obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad);

        foreach ($datospersonas as $key => $persona) {
            if ($persona) {
                $arraypersonas[$cont]['idpersonabrigada'] = $persona['idpersonabrigada'];
                $arraypersonas[$cont]['idpersona'] = $persona['idpersona'];
                $arraypersonas[$cont]['idcargo'] = $persona['idcargo'];

                $cont ++;
            }
        }
        return $arraypersonas;
    }
     
    public static function insertarDatosPersonaBrigada($arraydatos) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
       
        foreach ($arraydatos as $key => $value) {

            $idgrupoescala = self::obtenerIdGrupoEscala($value['idcargo']);

            $importe = self::obtenerImporte($value['idcargo']);
            $trt = $value['TRT'];
            $ft = $value['FT'];

            $idpersonabrigada = $value['idpersonabrigada'];

            if ($idgrupoescala) {             
                $sql = "UPDATE mod_nomina.dat_personabrigada 
                        SET
                        idgrupoescala = $idgrupoescala 
                        WHERE idpersonabrigada = $idpersonabrigada;";
                $conn->execute($sql);
            }

            $sql = "UPDATE mod_nomina.dat_personabrigada 
                SET
                importe = $importe,
                trt = $trt,
                ft = $ft
                WHERE idpersonabrigada = $idpersonabrigada;";
            $conn->execute($sql);
        }

        return 'ok';
    }
     
    public static function insertarSalarios($arraydatos) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $confiFormua = self::obtenerConfirmaFormula();  
        foreach ($arraydatos as $key => $value) {

            $idpersonabrigada = $value['idpersonabrigada'];
            $importe = $value['importe'];
            $trt = $value['trt'];
            $ft = $value['ft'];
            $evalu = $value['evaluacion'];

            $salariotrt = $importe / $ft * $trt;

            $salarioeval = $salariotrt * $evalu;

            $sql = "UPDATE mod_nomina.dat_personabrigada 
                SET
                salariotrt = $salariotrt,
                salarioeval = $salarioeval
                WHERE idpersonabrigada = $idpersonabrigada;";
            $conn->execute($sql);
        }

        return 'ok';
    }

    public static function obtenerConfirmaFormula() 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();      
        $sql = "SELECT cpg.denominacion, cpg.entrada, cpg.idformula, dem.expresionamostrar
            FROM mod_nomina.conf_pagodestajo cpg
            INNER JOIN mod_utiles.dat_expresionmatematica dem on (dem.idexpresionmatematica = cpg.idformula);";
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public static function obtenerIdGrupoEscala($idcargo) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();      
        $sqlidgrupoescala = "SELECT idgrupoescala FROM mod_nomina.conf_elementosalarialcargo WHERE idcargo = $idcargo;";
        $idgrupoescala = $conn->fetchOne($sqlidgrupoescala);
        return $idgrupoescala;
    }

    public static function obtenerImporte($idcargo) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();      
        $sqlidgrupoescala = "SELECT importe FROM mod_nomina.conf_elementosalarialcargo WHERE idcargo = $idcargo;";
        $idgrupoescala = $conn->fetchOne($sqlidgrupoescala);
        return $idgrupoescala;
    }

    public static function denomGrupoEscala($idgrupoescala) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection(); 
        if ($idgrupoescala) {     
            $sqldenominacion = "SELECT denominacion FROM mod_nomina.nom_grupoescala WHERE idgrupoescala = $idgrupoescala;";
            $denominacion = $conn->fetchOne($sqldenominacion);

            $result = $denominacion;
        }else {
            $result = null;
        }


        return $result;
    }
     
    public static function insertarEvaluacion($idplantilla, $arraydatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
       
        foreach ($arraydatos as $key => $value) {

            $sql = "UPDATE mod_nomina.dat_personabrigada 
                SET
                evaluacion = $value->evaluacion
                WHERE idpersonabrigada = $value->idpersonabrigada AND idplantillanominal = $idplantilla;";
            $conn->execute($sql);
        }

        return 'ok';
    }
     
    public static function insertarMontoCobrar($arraydatos, $idplantilla, $coeficiente)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
       
        foreach ($arraydatos as $key => $value) {
            $salarioeval = $value['salarioeval'];
            $cobro = $salarioeval * $coeficiente;
            $idpersonabrigada = $value['idpersonabrigada'];

            Doctrine_Query::create()
            ->update('DatPersonaBrigada dp')
            ->set('dp.montocobrar', '?', $cobro)
            ->where('dp.idpersonabrigada = ?', $idpersonabrigada)
            ->andWhere('dp.idplantillanominal = ?', $idplantilla)
            ->execute();

        }

        return 'ok';
    }

    public static function obtenerPersonaBrigadaDadoId($arraypersonas)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT idpersona, montocobrar
            FROM mod_nomina.dat_personabrigada WHERE idpersona IN (". implode(',', $arraypersonas) .");";
        $datos = $conn->fetchAll($sql);

        return $datos;        
    }
    
}
