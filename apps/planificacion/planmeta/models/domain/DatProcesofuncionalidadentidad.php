<?php

class DatProcesofuncionalidadentidad extends BaseDatProcesofuncionalidadentidad {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'idestado', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
                'DatProcesofuncionalidadestado', array('local' => 'idprocesofuncionalidadestado',
            'foreign' => 'idprocesofuncionalidadestado')
        );
    }

    public function getCB($parametros) {
        $modificar = "";
        if ($parametros->evento == 'Modificar') {
            $modificar = " AND pfe.identidad = " . ($parametros->identidad)
                    . " ";
        }
        if ($parametros->evento == 'Adicionar') {
            $IN = " NOT ";
            $LEFTJOINS = "";
            $SELECT = "";
            $WHEREMODIF = "";
        } else {
            $SELECT = " ,pfest.idprocesofuncionalidadestado ";
            $LEFTJOINS = "   LEFT JOIN mod_planificacion.dat_procesofuncionalidadentidad pfe
                ON filaestruct.idfila=pfe.identidad
				   LEFT JOIN  mod_planificacion.dat_procesofuncionalidadestado pfest 
				   ON pfe.idprocesofuncionalidadestado=pfest.idprocesofuncionalidadestado AND 
				   pfest.idejercicio=" . ($parametros->idejercicio)
                    . " AND pfest.idestado=" . ($parametros->idestado) . " AND
				   pfest.idprocesofuncionalidad="
                    . ($parametros->idprocesofuncionalidad) . " ";
            $IN = "";
            $WHEREMODIF = " AND pfest.idprocesofuncionalidadestado IS NOT NULL ";
        }
        $entidadrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $idrec = $entidadrectora[0]['identidad'];
        $cadenaSELECT = " SELECT  estruct.idestructura as id, estruct.denominacion as text "
                . $SELECT . " ";
        $cadenaJOIN = " FROM  mod_estructuracomp.nom_filaestruc filaestruct
						INNER JOIN mod_estructuracomp.dat_estructura estruct
						ON  filaestruct.idfila=estruct.idestructura
                                                
						INNER JOIN mod_planificacion.dat_entidaddatosnomenclador entdatnom
						ON filaestruct.idfila=entdatnom.identidad
						" . $LEFTJOINS . "";
        $cadenaWHERE = "  WHERE entdatnom.iddatosnomenclador=2 AND filaestruct.idpadre = $idrec AND filaestruct.idfila != $idrec "
                . $WHEREMODIF . "
						 AND estruct.idestructura " . $IN . " IN (SELECT pfe.identidad
						 FROM mod_planificacion.dat_procesofuncionalidadentidad pfe
						 INNER JOIN mod_planificacion.dat_procesofuncionalidadestado pfest
						 ON pfe.idprocesofuncionalidadestado= pfest.idprocesofuncionalidadestado
						 WHERE pfest.idejercicio=" . ($parametros->idejercicio)
                . " AND pfest.idestado="
                . ($parametros->idestado) . " " . $modificar
                . " AND pfest.idprocesofuncionalidad="
                . ($parametros->idprocesofuncionalidad) . ") ";
        $cadenaQUERY = "";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function listarPermisos($parametros) {


        if ($parametros['filtros']) {
            foreach ($parametros as $p => $s) {

                if ($s != null) {
                    if ($p == 'denomentidad') {
                        $cadenaWHERE .= " AND  pfe.identidad = " . ($s) . "";
                    }
                    if ($p == 'ejercicio') {
                        $cadenaWHERE .= " AND  nep.ejercicio LIKE '%" . ($s)
                                . "%'";
                    } else {
                        if ($p == 'guardar') {
                            if ($s == 'Si') {
                                $cadenaWHERE .= " AND  pfe.guardar = 1";
                            } else {
                                if ($s == 'No') {
                                    $cadenaWHERE .= " AND  pfe.guardar = 0";
                                }
                            }
                        } else {
                            if ($p == 'insertar') {
                                if ($s == 'Si') {
                                    $cadenaWHERE .= " AND  pfe.insertar = 1";
                                } else {
                                    if ($s == 'No') {
                                        $cadenaWHERE .= " AND  pfe.insertar = 0";
                                    }
                                }
                            } else {
                                if ($p == 'modificar') {
                                    if ($s == 'Si') {
                                        $cadenaWHERE .= " AND  pfe.modificar = 1";
                                    } else {
                                        if ($s == 'No') {
                                            $cadenaWHERE .= " AND  pfe.modificar = 0";
                                        }
                                    }
                                } else {
                                    if ($p == 'eliminar') {
                                        if ($s == 'Si') {
                                            $cadenaWHERE .= " AND  pfe.eliminar = 1";
                                        } else {
                                            if ($s == 'No') {
                                                $cadenaWHERE .= " AND  pfe.eliminar = 0";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $entidadrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $idrec = $entidadrectora[0]['identidad'];
        if ($entidadrectora[0]['identidad']) {
            $cadenaSELECT = " SELECT pfe.eliminar, pfe.guardar, pfest.idejercicio,
            pfe.identidad, pfest.idestado,
				pfest.idprocesofuncionalidad, pfe.idprocesofuncionalidadentidad, pfe.insertar, 
				pfe.modificar, nep.ejercicio, estruct.denominacion AS denomentidad ";
            $cadenaJOIN = " FROM mod_planificacion.dat_procesofuncionalidadentidad pfe
						INNER JOIN mod_planificacion.dat_procesofuncionalidadestado pfest 
						 ON pfe.idprocesofuncionalidadestado=pfest.idprocesofuncionalidadestado
						 INNER JOIN mod_planificacion.nom_ejercicioplanificacion nep
						 ON nep.idejercicio=pfest.idejercicio
						 INNER JOIN mod_estructuracomp.nom_filaestruc filaestruct
						 ON filaestruct.idfila=pfe.identidad
						 INNER JOIN mod_estructuracomp.dat_estructura estruct
						 ON  filaestruct.idfila=estruct.idestructura
                                                
						 INNER JOIN mod_planificacion.dat_entidaddatosnomenclador entdatnom
						 ON filaestruct.idfila=entdatnom.identidad
  ";
            $cadenaWHERE = "  WHERE entdatnom.iddatosnomenclador=2 AND pfest.idestado="
                    . ($parametros['idestado']) . "
						AND pfest.idprocesofuncionalidad="
                    . ($parametros['idprocesofuncionalidad']) . "
						AND filaestruct.idpadre=$idrec ";
            $cadenaQUERY = "";


            $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
            $conex = Doctrine_Manager:: connection();
            $result['total'] = count($conex->execute($cadenaQUERY)->fetchAll());
            $cadenaQUERY .= " order by nep.ejercicio, estruct.denominacion";
            $cadenaQUERY .= " LIMIT(" . $parametros['limit'] . ") OFFSET("
                    . $parametros['start'] . ") ";
            $result['data'] = $conex->execute($cadenaQUERY)->fetchAll();
            return $result;
        } else {
            return 3;
        }
    }

    public function listarModificarPermisos($parametros) {
        $query = Doctrine_Query::create();

        $result = $query->select(
                        'pfe.identidad,  pfest.idestado as idestado,
                        pfest.idejercicio as idejercicio,
                        nep.ejercicio as ejercicio'
                )
                ->from('DatProcesofuncionalidadentidad pfe')
                ->innerJoin('pfe.DatProcesofuncionalidadestado pfest')
                ->innerJoin('pfest.NomEjercicioplanificacion nep')
                ->addWhere("pfest.idestado = ?", $parametros->idestado)
                ->addWhere("pfest.idejercicio = ?", $parametros->idejercicio)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function Insertar($param) {

        $conn = Doctrine_Manager::connection();
        $query = "INSERT INTO mod_planificacion.dat_procesofuncionalidadentidad
( idprocesofuncionalidadestado,identidad,guardar,
eliminar,modificar,insertar) 
VALUES (" . $param->idprocesofuncionalidadestado . "," . $param->identidad . ",
  " . $param->guardar . "," . $param->eliminar . "," . $param->modificar . ","
                . "" . $param->insertar . ")";

        $res = $conn->execute($query);
        $res->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

    public function BuscaridFuncionalidadestadodadoid($param) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT funcestado.idprocesofuncionalidadestado
FROM  mod_planificacion.dat_procesofuncionalidadentidad as funcestado
WHERE funcestado.idprocesofuncionalidadentidad=" . $param . "";
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['idprocesofuncionalidadestado'];
    }

    public function EliminarDadoEstadoeidentidad($ident, $idprocesfuncest) {

        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM 
  mod_planificacion.dat_procesofuncionalidadentidad as funcenti
WHERE 
  funcenti.idprocesofuncionalidadestado= " . $idprocesfuncest . " and "
                . "funcenti.identidad IN (" . $ident . ") ";
        $res = $conn->execute($query);
        $res->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

    public function Eliminar($param) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM mod_planificacion.dat_procesofuncionalidadentidad 
        WHERE idprocesofuncionalidadentidad ="
                . $param . " ";
        $res = $conn->execute($query);
        $res->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

}
