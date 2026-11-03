<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpImportarModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Nombre de la función ImportarDatos
     * Descripcion Funcion que se encarga de insertar la información por cada
     * tabla de la BD, agrega la inf. nueva y en dependencia de la seleccion
     * del usuario sobreescribe o no la existente.
     *
     * @author * Mairelys Fernandez
     *
     * @param Array   $objeto       - arreglo que contiene la infomacion que
     *                              se desea importar.
     * @param Integer $sobrescribir - variable que indica si el usuario desea
     *                              sobreescribir o no la informacion.
     *
     * @return
     */
    //******************** Verificar Fallos ***********************//

    public function ImportarDatos($idimportacion)
    {
        $arrayrepetidos = array();
        $fallos = array();
        /* Obtener el fichero sqlite correspondiente al idimportacion */
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/planificacion/temp/';
        $tempfile = $temppath . $idimportacion . ".sipac";
        /* Conectarme a la bd sqlite */
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        /* Comprobar fallos y repetidos en Elementos */
        $fallos = $this->VerificarElementos($db, $fallos);
        /* Comprobar fallos en los nomencladores de criterios de medida */
        $fallos = $this->VerificarNomCriteriosMedida($db, $fallos);
        /* Comprobar fallos en los nomencladores asociados a los elementos */
        $fallos = $this->VerificarNomElementos($db, $fallos);
        /* marcar repetidos en ARC */
        $this->VerificarArc($db);
        //$repuesta= $this->devolverElementosRepetidos($db);        
        $arrayrepetidos = $this->devolverElementosRepetidos($db);
        $respuesta ['repetidos'] = empty($arrayrepetidos) ? array()
            : $arrayrepetidos;
        $respuesta ['fallos'] = array($fallos);
        return $respuesta;
    }

    private function VerificarElementos($db, $fallos)
    {
        /* Comprobar los elementos repetidos en la bd local */
        /* Obtener los elementos a importar de la bd sqlite */
        $stmt = $db->query(
            "SELECT idelemento, idestadoaprob, idtipoelemento, denelemento
                    FROM dat_elementos"
        );
        $respuesta = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($respuesta[0])) {
            $arrayElementos = array();
            foreach ($respuesta as $r) {
                $arrayElementos[] = $r[0];
            }
            /* Obtener los elementos que se repiten en bd local */
            $datElementos = new DatElementos();
            $result = $datElementos->ObtenerElementosExistentes(
                $arrayElementos
            );
            $existentes = array();
            foreach ($result as $e) {
                $existentes[] = $e['idelemento'];
            }
            foreach ($respuesta as $elemento) {
                /* Si el elemento es un repetido */
                if (!in_array($elemento[0], $existentes)) {
                    /* marco al elemento como nuevo en la bd sqlite */
                    $stmt = $db->query(
                        "UPDATE dat_elementos SET nuevo = 1
                                WHERE idelemento = $elemento[0]"
                    );
                } else {
                    /* marco al elemento como repetido en la bd sqlite */
                    $stmt = $db->query(
                        "UPDATE dat_elementos SET nuevo = 0
                                WHERE idelemento = $elemento[0]"
                    );
                }
                /* Comprobar si el estado de aprobacion esta en la bd local */
                if ($elemento[1]) {
                    $existestado = $this->pIntegrator->workflow->DenomEstado(
                        $elemento[1]
                    );
                    if (!isset($existestado[0])) {
                        $fallos [$elemento[0]]['tipoelem'] = $elemento[2];
                        $fallos [$elemento[0]]['denominacion']
                            = $elemento[3] . $elemento[2];
                        $fallos [$elemento[0]]['tiponomenclador'][]
                            = "Estado de aprobación";
                    }
                }
            }
        }
        return $fallos;
    }

    private function VerificarArc($db)
    {
        /* Comprobar los arc repetidos en la bd local */
        /* Obtener los arc a importar de la bd sqlite */
        $stmt = $db->query("SELECT idarc FROM dat_arc");
        $respuesta = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($respuesta[0])) {
            $arrayArc = array();
            foreach ($respuesta as $r) {
                $arrayArc[] = $r[0];
            }
            /* Obtener los arc que se repiten en bd local */
            $datArc = new DatArc();
            $result = $datArc->ObtenerArcExistentes($arrayArc);

            $existentes = array();
            foreach ($result as $a) {
                $existentes[] = $a['idarc'];
            }
            foreach ($respuesta as $arc) {
                /* Si el arc es un repetido */
                if (!in_array($arc[0], $existentes)) {
                    /* marco al elemento como nuevo en la bd sqlite */
                    $stmt = $db->exec(
                        "UPDATE dat_arc SET nuevo = 1 WHERE idarc = $arc[0]"
                    );
                } else /* marco al elemento como nuevo en la bd sqlite */ {
                    $stmt = $db->exec(
                        "UPDATE dat_arc SET nuevo = 0 WHERE idarc = $arc[0]"
                    );
                }
            }
        }
    }

    private function VerificarNomCriteriosMedida($db, $fallos)
    {
        $stmtb = $db->query(
            "SELECT idcriteriomedida, idumedida, idobjetivo
                    FROM dat_criteriomedida"
        );
        $respuesta = $stmtb->fetchAll(PDO::FETCH_NUM);
        if (isset($respuesta[0])) {
            //Marco como nuevos los crierios de medida que no existen en la BD local
            $arraycm = array();
            foreach ($respuesta as $cm) {
                $arraycm[] = $cm[0];
            }
            /* Obtener los criterios de medida que se repiten en bd local */
            $datcriterio = new DatCriteriomedida();
            $result = $datcriterio->ObtenerCriteriosExistentes($arraycm);

            $existentes = array();
            foreach ($result as $a) {
                $existentes[] = $a['idcriteriomedida'];
            }
            foreach ($respuesta as $criterio) {

                if (!in_array($criterio[0], $existentes)) {
                    /* marco al elemento como nuevo en la bd sqlite */
                    $stmt = $db->exec(
                        "UPDATE dat_criteriomedida SET nuevo = 1
                                WHERE idcriteriomedida = $criterio[0] "
                    );
                } else {
                    $stmt = $db->exec(
                        "UPDATE dat_criteriomedida SET nuevo = 0
                                WHERE idcriteriomedida = $criterio[0]"
                    );
                }
            }
            //Fallos en la UM de los Criterios de Medida
            foreach ($respuesta as $cm) {
                $idum
                    = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                    $cm[1]
                );
                if (!isset($idum[0])) {
                    $stmtk = $db->query(
                        "SELECT denelemento FROM dat_elementos
                                WHERE idelemento = $cm[2]"
                    );
                    $resultb = $stmtk->fetchAll(PDO::FETCH_NUM);
                    $fallos [$criteriomedida[$cm[2]]]['tipoelem'] = 1;
                    $fallos [$criteriomedida[$cm[2]]]['denominacion']
                        = $resultb[0][0] . 1;
                    $fallos [$criteriomedida[$cm[2]]]['tiponomenclador'][]
                        = "UM del Criterio de Medida";
                }
            }
        }
        return $fallos;
    }

    private function VerificarNomElementos($db, $fallos)
    {
        $stmt = $db->query(
            "SELECT idnomenclador, idelemento, tiponomenclador
                    FROM dat_elementos_nom_nomenclador"
        );
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $nomelemento) {
                $datosnom
                    = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                    $nomelemento[0]
                );
                if (!isset($datosnom)) {
                    $stmte = $db->query(
                        "SELECT denelemento FROM dat_elementos
                                WHERE idelemento = $nomelemento[1]"
                    );
                    $resulta = $stmte->fetchAll(PDO::FETCH_NUM);

                    $denominacion = $resulta[0];
                    $tipo = $resulta[1];

                    if ($nomelemento[2] == 0) {
                        $nomelemento[2] = "Categoría Plan";
                    }
                    if ($nomelemento[2] == 1) {
                        $nomelemento[2] = "Unidad de Medida Criterio";
                    }
                    if ($nomelemento[2] == 2) {
                        $nomelemento[2] = "Categoría Actividad";
                    }
                    if ($nomelemento[2] == 3) {
                        $nomelemento[2] = "Tipo Actividad";
                    }
                    if ($nomelemento[2] == 4) {
                        $nomelemento[2] = "Categoría Fip";
                    }
                    if ($nomelemento[2] == 5) {
                        $nomelemento[2] = "Nom Datos Proc Fip";
                    }
                    if ($nomelemento[2] == 6) {
                        $nomelemento[2] = "Estado de Cumplimiento";
                    }
                    if ($nomelemento[2] == 7) {
                        $nomelemento[2] = "Nivel Acceso del FIP";
                    }

                    if (isset($fallos[$nomelemento[1]])) {
                        $fallos [$nomelemento[1]]['tiponomenclador'][]
                            = $nomelemento[2];
                    } else {
                        $fallos [$nomelemento[1]]['tipoelem'] = '' . $tipo;
                        $fallos [$nomelemento[1]]['denominacion']
                            = "$denominacion" . $tipo;
                        $fallos [$nomelemento[1]]['tiponomenclador'] []
                            = $nomelemento[2];
                    }
                }
            }
        }

        return $fallos;
    }

//******************** Devolver Elementos Repetidos ***********************//

    public function devolverElementosRepetidos($db)
    {
        /* Obtener los elementos del 1er nivel que estan repetidos */
        $sql
            = "SELECT  idtipoelemento, denelemento, idusuariocrea, idelemento
                FROM dat_elementos         
                WHERE nuevo <> 1 AND idelemento NOT IN (SELECT idelementohijo 
                FROM dat_elementos_dat_elementos  WHERE origen <> 1 
                ORDER BY idelementohijo)
                GROUP BY idelemento, idtipoelemento,denelemento,idusuariocrea";
        $stmtd = $db->query($sql);
        $resultd = $stmtd->fetchAll(PDO::FETCH_NUM);

        if (isset($resultd[0])) {
            foreach ($resultd as $elementorep) {
                $elemento = new stdClass();
                $elemento->idelemento = $elementorep[3];
                $elemento->tipoelem = $elementorep[0];
                $elemento->denominacion = $elementorep[1] . $elemento->tipoelem;
                $elemento->nombreautor
                    = $this->integrator->seguridad->nombreUsuario(
                    $elementorep[2]
                );
                $elemento->_parent = null;
                $elemento->_is_leaf = $this->tieneHijos(
                    $db, $elementorep[3], $elementorep[0]
                );
                $informacionrepetida[] = $elemento;
            }
        }

        /* Obtener los arc del 1er nivel que estan repetidos */
        $sql
            = "SELECT idarc, denarc, idusuariocrea
                 FROM dat_arc WHERE idarc = idarcp AND nuevo <> 1";
        $stmtc = $db->query($sql);
        $resultc = $stmtc->fetchAll(PDO::FETCH_NUM);

        if (isset($resultc[0])) {
            foreach ($resultc as $arcrep) {
                $arc = new stdClass();
                $arc->idelemento = $arcrep[0];
                $arc->tipoelem = 5;
                $arc->denominacion = $arcrep[1] . $arc->tipoelem;
                $arc->nombreautor = $this->integrator->seguridad->nombreUsuario(
                    $arcrep[2]
                );
                $arc->_parent = null;
                $arc->_is_leaf = $this->tieneHijos($db, $arcrep[0], 5);
                $informacionrepetida[] = $arc;
            }
        }
        return $informacionrepetida;
    }

    public function devolverElementosHijos($idimportacion, $idelemento, $tipo)
    {
        /* Obtener el fichero sqlite correspondiente al idimportacion */
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/planificacion/temp/';
        $tempfile = $temppath . $idimportacion . ".sipac";
        /* Conectarme a la bd sqlite */
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $informacionhijos = array();
        if ($tipo != 5) {
            $sql
                = " SELECT  idtipoelemento, denelemento,
                     idusuariocrea, idelemento 
                     FROM dat_elementos  
                     INNER JOIN dat_elementos_dat_elementos 
                     ON idelementohijo = idelemento
                     WHERE idelementopadre = $idelemento 
                     AND (origen = 0 OR origen = 4 ) AND nuevo <> 1 
                     GROUP BY idelemento, idtipoelemento,
                     denelemento,idusuariocrea";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
            if (isset($result[0])) {
                foreach ($result as $elemhijos) {
                    $elemento = new stdClass();
                    $elemento->idelemento = $elemhijos[3];
                    $elemento->tipoelem = $elemhijos[0];
                    $elemento->denominacion
                        = $elemhijos[1] . $elemento->tipoelem;
                    $elemento->nombreautor
                        = $this->integrator->seguridad->nombreUsuario(
                        $elemhijos[2]
                    );
                    $elemento->idimportacion = $idimportacion;
                    $elemento->_parent = $idelemento;
                    $elemento->_is_leaf = $this->tieneHijos(
                        $db, $elemhijos[3], $elemhijos[0]
                    );
                    $informacionhijos['infhijos'][] = $elemento;
                }
            }
        } else {
            $sql
                = "SELECT idarc, denarc, idusuariocrea
                    FROM dat_arc 
                    WHERE idarcp = $idelemento AND idarcp <> idarc 
                    AND nuevo <> 1";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
            if (isset($result[0])) {
                foreach ($result as $archijas) {
                    $arc = new stdClass();
                    $arc->idelemento = $archijas[0];
                    $arc->tipoelem = 5;
                    $arc->denominacion = $archijas[1] . $arc->tipoelem;
                    $arc->nombreautor
                        = $this->integrator->seguridad->nombreUsuario(
                        $archijas[2]
                    );
                    $arc->idimportacion = $idimportacion;
                    $arc->_parent = $idelemento;
                    $arc->_is_leaf = $this->tieneHijos($db, $archijas[0], 5);
                    $informacionhijos['infhijos'][] = $arc;
                }
            }
        }
        return $informacionhijos;
    }

    private function tieneHijos($db, $idelemento, $idtipoelemento)
    {
        $hoja = true;

        if ($idtipoelemento != 5) {
            $sql
                = " SELECT
                     COUNT(idelemento)  
                     FROM dat_elementos 
                     INNER JOIN dat_elementos_dat_elementos 
                     ON idelementohijo = idelemento
                     WHERE idelementopadre = $idelemento 
                     AND (origen = 0 OR origen = 4 ) AND nuevo <> 1";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
        } else {
            $sql
                = " SELECT
                     COUNT(idarc)  
                     FROM dat_arc              
                     WHERE idarcp = $idelemento AND idarcp <> idarc 
                     AND nuevo <> 1 ";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
        }

        if ($result[0][0] > 0) {
            $hoja = false;
        }

        return $hoja;
    }

//******************** Comparacion_Persistido_Repetido***********************//

    public function comparacion_Persistido_Repetido($id, $tipo, $idimportacion)
    {
        /* Obtener el fichero sqlite correspondiente al idimportacion */
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/planificacion/temp/';
        $tempfile = $temppath . $idimportacion . ".sipac";
        /* Conectarme a la bd sqlite */
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        if ($tipo != 5) {
            $respuesta = $this->datosElemento_Persistido_Repetido($id, $db);
        } else {
            $respuesta = $this->datosArc_Persistida_Repetida($id, $db);
        }
        return $respuesta;
    }

    public function datosElemento_Persistido_Repetido($id, $db)
    {
        $objdatelemento = new DatElementos();
        $elempersistido = $objdatelemento->BuscarElementoPersistido($id);
        $datoselementoper = new stdClass();
        $datoselementoper = $this->datosElemento_Persistido($elempersistido);
        $elemrepetido = $this->BuscarElementoRepetido($id, $db);
        $datoselementorep = new stdClass();
        $datoselementorep = $this->datosElemento_Repetido($elemrepetido);
        switch ($datoselementoper->idtipoelemento) {
            case 0:
                $datoselementoper = $this->datosPlan_Persistido(
                    $id, $datoselementoper
                );
                $datoselementorep = $this->datosPlan_Repetido(
                    $id, $datoselementorep, $db
                );
                break;
            case 1:
                $datoselementoper = $this->datosObjetivo_Persistido(
                    $id, $datoselementoper
                );
                $datoselementorep = $this->datosObjetivo_Repetido(
                    $id, $datoselementorep, $db
                );
                break;
            case 2:
                $datoselementoper = $this->datosFip_Persistido(
                    $id, $datoselementoper
                );
                $datoselementorep = $this->datosFip_Repetido(
                    $id, $datoselementorep, $db
                );
                break;
            case 3:
                $datoselementoper = $this->datosActividades_Persistido(
                    $id, $datoselementoper
                );
                $datoselementorep = $this->datosActividades_Repetido(
                    $id, $datoselementorep, $db
                );
                break;
        }
        $respuesta ['datosPersistentes'] = $datoselementoper;
        $respuesta ['datosAImport'] = $datoselementorep;
        return $respuesta;
    }

    public function datosElemento_Persistido($elempersistido)
    {
        $datoselementoper = new stdClass();
        $datoselementoper->idelemento = $elempersistido[0]['idelemento'];
        $datoselementoper->idtipoelemento
            = $elempersistido[0]['idtipoelemento'];
        $datoselementoper->denelemento = $elempersistido[0]['denelemento'];
        $datoselementoper->descelemento = (
        $elempersistido[0]['descelemento']) ? $elempersistido[0]['descelemento']
            : '-';
        $datoselementoper->idusuariocrea = $elempersistido[0]['idusuariocrea'];
        $datoselementoper->llevahistorial
            = $elempersistido[0]['llevahistorial'];
        $datoselementoper->activo = $elempersistido[0]['activo'];
        $datoselementoper->gradocumplimiento
            = $elempersistido[0]['gradocumplimiento'];
        $datoselementoper->privado = $elempersistido[0]['privado'];
        $datoselementoper->participante = (
        $elempersistido[0]['participante']) ? $elempersistido[0]['participante']
            : '-';
        $datoselementoper->idestadoaprob = $elempersistido[0]['idestadoaprob'];
        $datoselementoper->estadocumplimiento
            = $elempersistido[0]['estadocumplimiento'];
        $datoselementoper->dirigente = (
        $elempersistido[0]['dirigente']) ? $elempersistido[0]['dirigente']
            : '-';
        return $datoselementoper;
    }

    public function datosElemento_Repetido($elemrepetido)
    {
        $datoselementorep = new stdClass();
        $datoselementorep->idelemento = $elemrepetido[0][0];
        $datoselementorep->idtipoelemento = $elemrepetido[0][1];
        $datoselementorep->denelemento = $elemrepetido[0][2];
        $datoselementorep->descelemento = ($elemrepetido[0][3])
            ? $elemrepetido[0][3] : '-';
        $datoselementorep->idusuariocrea = $elemrepetido[0][4];
        $datoselementorep->llevahistorial = $elemrepetido[0][5];
        $datoselementorep->activo = $elemrepetido[0][6];
        $datoselementorep->gradocumplimiento = $elemrepetido[0][7];
        $datoselementorep->privado = $elemrepetido[0][8];
        $datoselementorep->participante = ($elemrepetido[0][9])
            ? $elemrepetido[0][9] : '-';
        $datoselementorep->idestadoaprob = $elemrepetido[0][10];
        $datoselementorep->estadocumplimiento = $elemrepetido[0][11];
        $datoselementorep->dirigente = ($elemrepetido[0][12])
            ? $elemrepetido[0][12] : '-';
        return $datoselementorep;
    }

    public function datosPlan_Persistido($id, $datoselementoper)
    {
        $existe = Doctrine::getTable('DatPlanPdo')->find($id);
        if (isset($existe->idplan)) {
            $datoselementoper->fechainicio = $existe->fechainicio;
            $datoselementoper->fechafin = $existe->fechafin;
        }
        return $datoselementoper;
    }

    public function datosPlan_Repetido($id, $datoselementorep, $db)
    {
        $sql
            = "SELECT  *
                FROM dat_plan_pdo                   
                WHERE idplan = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datoselementorep->fechainicio = $result[0][1];
            $datoselementorep->fechafin = $result[0][2];
        }
        return $datoselementorep;
    }

    public function datosObjetivo_Persistido($id, $datoselementoper)
    {
        $existe = Doctrine::getTable('DatObjetivo')->find($id);
        if (isset($existe->idobjetivo)) {
            $datoselementoper->fechainicio = $existe->fechainicio;
            $datoselementoper->fechafin = $existe->fechafin;
        }
        return $datoselementoper;
    }

    public function datosObjetivo_Repetido($id, $datoselementorep, $db)
    {
        $sql
            = "SELECT  *
                FROM dat_objetivo                   
                WHERE idobjetivo = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            $datoselementorep->fechainicio = $result[0][1];
            $datoselementorep->fechafin = $result[0][2];
        }
        return $datoselementorep;
    }

    public function datosActividades_Persistido($id, $datoselementoper)
    {
        $existe = Doctrine::getTable('DatActividades')->find($id);
        if (isset($existe->idactividad)) {
            $datoselementoper->fechainicio = $existe->fechainicio;
            $datoselementoper->fechafin = $existe->fechafin;
            $datoselementoper->tiporepeticion = $existe->tiporepeticion;
            $datoselementoper->horainicio = $existe->horainicio;
            $datoselementoper->horafin = $existe->horafin;
            $datoselementoper->lugar = ($existe->lugar) ? $existe->lugar : '-';
            $datoselementoper->esprincipal = $existe->esprincipal;
        }
        return $datoselementoper;
    }

    public function datosActividades_Repetido($id, $datoselementorep, $db)
    {
        $sql
            = "SELECT  *
                FROM dat_actividades                   
                WHERE idactividad = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datoselementorep->fechainicio = $result[0][2];
            $datoselementorep->fechafin = $result[0][3];
            $datoselementorep->tiporepeticion = $result[0][1];
            $datoselementorep->horainicio = $result[0][4];
            $datoselementorep->horafin = $result[0][5];
            $datoselementorep->lugar = ($result[0][6]) ? $result[0][6] : '-';
            $datoselementorep->esprincipal = $result[0][7];
        }
        return $datoselementorep;
    }

    public function datosFip_Persistido($id, $datoselementoper)
    {
        $existe = Doctrine::getTable('DatFip')->find($id);
        if (isset($existe->idfip)) {
            $datoselementoper->emite = ($existe->emite) ? $existe->emite : '-';
            $datoselementoper->fechaemision = $existe->fechaemision;
            $datoselementoper->fechacumplimiento = $existe->fechacumplimiento;
            $datoselementoper->fechacumplio = (
            $existe->fechacumplio) ? $existe->fechacumplio : '-';
            $datoselementoper->numfip = (
            $existe->numfip) ? $existe->numfip : '-';
            $datoselementoper->documentorigen = $existe->documentorigen;
        }
        return $datoselementoper;
    }

    public function datosFip_Repetido($id, $datoselementorep, $db)
    {
        $sql
            = "SELECT  *
                FROM dat_fip                   
                WHERE idfip = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datoselementorep->emite = ($result[0][1]) ? $result[0][1] : '-';
            $datoselementorep->fechaemision = $result[0][2];
            $datoselementorep->fechacumplimiento = $result[0][3];
            $datoselementorep->fechacumplio = (
            $result[0][4]) ? $result[0][4] : '-';
            $datoselementorep->numfip = ($result[0][5]) ? $result[0][5] : '-';
            $datoselementorep->documentorigen = $result[0][6];
        }
        return $datoselementorep;
    }

    private function datosArc_Persistida_Repetida($id, $db)
    {
        $objdatarc = new DatArc();
        $arcpersistido = $objdatarc->BuscarArcPersistida($id);
        $datosarcper = new stdClass();
        $datosarcper->idarc = $arcpersistido[0]['idarc'];
        $datosarcper->denelemento = $arcpersistido[0]['denarc'];
        $datosarcper->descelemento = (
        $arcpersistido[0]['descrip']) ? $arcpersistido[0]['descrip'] : '-';
        $datosarcper->idusuariocrea = $arcpersistido[0]['idusuariocrea'];
        $datosarcper->fechacreacion = $arcpersistido[0]['fechacreacion'];
        $datosarcper->fechainicio = $arcpersistido[0]['fechainicio'];
        $datosarcper->fechafin = (
        $arcpersistido[0]['fechafin']) ? $arcpersistido[0]['fechafin'] : '-';
        $datosarcper->activo = $arcpersistido[0]['activo'];
        $datosarcper->caduca = $arcpersistido[0]['caduca'];
        $datosarcper->idarcp = $arcpersistido[0]['idarcp'];
        //Buscar el arc repetida en la BD SQLITE
        $sql
            = "SELECT  *
                FROM dat_arc                   
                WHERE idarc = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datosarcrep->idarc = $result[0][0];
            $datosarcrep->denelemento = $result[0][4];
            $datosarcrep->descelemento = ($result[0][5]) ? $result[0][5] : '-';
            $datosarcrep->idusuariocrea = $result[0][6];
            $datosarcrep->fechacreacion = $result[0][7];
            $datosarcrep->fechainicio = $result[0][8];
            $datosarcrep->fechafin = ($result[0][9]) ? $result[0][9] : '-';
            $datosarcrep->activo = $result[0][10];
            $datosarcrep->caduca = $result[0][11];
            $datosarcrep->idarcp = $result[0][1];
        }
        $respuesta ['datosPersistentes'] = $datosarcper;
        $respuesta ['datosAImport'] = $datosarcrep;

        return $respuesta;
    }

    public function BuscarElementoRepetido($id, $db)
    {
        $sql
            = " SELECT  *
                 FROM dat_elementos                   
                 WHERE idelemento = $id";

        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        return $result;
    }

//********** Importar Inf Nueva y Sobrescribir Inf Repetida (true)**********//

    public function InsertarInformacionBDLocal(
        $sobrescribir, $idimportacion, $tipoelemento, $iddominio,
        $idusuario, $certificado
    ) {
        $arrayIdElemInsert = array();
        /* Obtener el fichero sqlite correspondiente al idimportacion */
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/planificacion/temp/';
        $tempfile = $temppath . $idimportacion . ".sipac";
        /* Conectarme a la bd sqlite */
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        /* Se llama a las funcionalidades para insertar toda la iformacion nueva */
        $this->ImportarElementos($db);
        $this->ImportarPlanes($db);
        $this->ImportarObjetivos($db);
        $this->ImportarCriteriosMedida($db);
        $this->ImportarFip($db);
        $this->ImportarAct($db);
        $this->ImportarARC($db);
        $this->ImportarNomNomencladoresPorElementos($db);
        $this->ImportarRelacionEntreElementos($db);
        $this->ImportarInvolucradosPorElemento($db);
        $this->ImportarInvolucradosPorArc($db);
        $this->ImportarInvolucradosPorCriterio($db);
        $this->ImportarRelacionArcPlan($db);
        $this->ImportarRelacionArcPlanActividades($db);
        $this->ImportarRelacionArcPlanObjetivo($db);
        /* Se llama a las funcionalidades para sobrescribir inf repetida */

        if ($sobrescribir == 'true') {
            $arrayIdElemInsert = $this->sobrescribirEnDatElementos(
                $db, $tipoelemento, $arrayIdElemInsert
            );
            $arrayIdElemInsert = $this->sobrescribirEnDatArc(
                $db, $tipoelemento, $arrayIdElemInsert
            );
        }
        if ($tipoelemento != 5) {
            /* Consulta a BD SQLITE para obtener los elementos nuevos */
            $sql
                = "SELECT idelemento
                FROM dat_elementos                   
                WHERE nuevo = 1 AND idtipoelemento = $tipoelemento";
            $stmt = $db->query($sql);
            $nuevos = $stmt->fetchAll(PDO::FETCH_NUM);

            /* Adicionando los elementos nuevos al array respuesta */
            foreach ($nuevos as $value) {
                $arrayIdElemInsert[] = $value[0];
            }
        } else {
            /* Consulta a BD SQLITE para obtener los elementos nuevos */
            $sql
                = "SELECT idelemento
                FROM dat_elementos                   
                WHERE nuevo = 1 AND idtipoelemento = $tipoelemento";
            $stmt = $db->query($sql);
            $nuevos = $stmt->fetchAll(PDO::FETCH_NUM);

            /* Adicionando los elementos nuevos al array respuesta */
            foreach ($nuevos as $value) {
                $arrayIdElemInsert[] = $value[0];
            }
        }
        $objexpimport = new CmpexportarimportarModel();

        if (isset($arrayIdElemInsert[0])) {
            return $objexpimport->DevolverElementosDeUnTipoDeterminado(
                $tipoelemento, $arrayIdElemInsert, $iddominio,
                $idusuario, $certificado
            );
        }

        return array('resultado' => array());
    }

//************** Insertar la informacion nueva en BD local ***********//    

    public function ImportarElementos($db)
    {
        $sql
            = "SELECT  *
                FROM dat_elementos                   
                WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $key => $elemento) {
                $datelemento = new DatElementos();
                $datelemento->idelemento = $elemento[0];
                $datelemento->idtipoelemento = $elemento[1];
                $datelemento->denelemento = $elemento[2];
                $datelemento->descelemento = $elemento[3];
                $datelemento->idusuariocrea = $elemento[4];
                $datelemento->llevahistorial = $elemento[5];
                $datelemento->activo = $elemento[6];
                $datelemento->gradocumplimiento = $elemento[7];
                $datelemento->privado = $elemento[8];
                $datelemento->participante = $elemento[9];
                $datelemento->idestadoaprob = $elemento[10];
                $datelemento->estadocumplimiento = $elemento[11];
                $datelemento->dirigente = $elemento[12];
                $datelemento->save();
                $datelemento->idelemento = $elemento[0];
                $datelemento->save();
            }
        }
    }

    public function ImportarPlanes($db)
    {
        $sql
            = "SELECT  *
                FROM dat_plan_pdo  
                INNER JOIN  dat_elementos ON idelemento = idplan 
                WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $key => $plan) {
                $datplan = new DatPlanPdo();
                $datplan->fechainicio = $plan[1];
                $datplan->fechafin = $plan[2];
                $datplan->idplan = $plan[0];
                $datplan->save();
            }
        }
    }

    public function ImportarObjetivos($db)
    {
        $sql
            = "SELECT  *
                FROM dat_objetivo 
                INNER JOIN  dat_elementos ON idelemento = idobjetivo 
                WHERE nuevo = 1 ";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $key => $objetivo) {
                $datobjetivo = new DatObjetivo();
                $datobjetivo->fechainicio = $objetivo[1];
                $datobjetivo->fechafin = $objetivo[2];
                $datobjetivo->idobjetivo = $objetivo[0];
                $datobjetivo->save();
            }
        }
    }

    public function ImportarAct($db)
    {
        $sql
            = "SELECT  *
                FROM dat_actividades  
                INNER JOIN  dat_elementos  ON idelemento = idactividad 
                WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $key => $actividad) {
                $datact = new DatActividades();
                $datact->tiporepeticion = $actividad[1];
                $datact->fechainicio = $actividad[2];
                $datact->fechafin = $actividad[3];
                $datact->horainicio = $actividad[4];
                $datact->horafin = $actividad[5];
                $datact->lugar = $actividad[6];
                $datact->esprincipal = $actividad[7];
                $datact->idactividad = $actividad[0];
                $datact->save();
            }
        }
    }

    public function ImportarFip($db)
    {
        $sql
            = "SELECT  *
                FROM dat_fip  
                INNER JOIN  dat_elementos ON idelemento = idfip 
                WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $key => $fip) {
                $datfip = new DatFip();
                $datfip->emite = $fip[1];
                $datfip->fechaemision = $fip[2];
                $datfip->fechacumplimiento = $fip[3];
                $datfip->fechacumplio = $fip[4];
                $datfip->numfip = $fip[5];
                $datfip->documentorigen = $fip[6];
                $datfip->idfip = $fip[0];
                $datfip->save();
            }
        }
    }

    public function ImportarARC($db)
    {
        $sql
            = "SELECT  *
                FROM dat_arc   
                WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $key => $arc) {
                $datarc = new DatArc();
                $datarc->denarc = $arc[4];
                $datarc->descrip = $arc[5];
                $datarc->idusuariocrea = $arc[6];
                $datarc->fechacreacion = $arc[7];
                $datarc->fechainicio = $arc[8];
                $datarc->fechafin = $arc[9];
                $datarc->activo = $arc[10];
                $datarc->caduca = $arc[11];
                $datarc->idarc = $arc[0];
                $datarc->idarcp = $arc[1];
                $datarc->save();
            }
        }
    }

    public function ImportarInvolucradosPorCriterio($db)
    {
        $sql
            = "SELECT  *
                FROM dat_criteriomedida_dat_involucrados";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        $objcriterioinvol = new DatCriterioDatInvolucrados();
        if (isset($result[0])) {
            foreach ($result as $key => $criteriomedidainv) {
                $existe = $objcriterioinvol->Buscar(
                    $criteriomedidainv[0], $criteriomedidainv[1]
                );
                if (!isset($existe)) {
                    $datcriteriomedidainvol = new DatCriterioDatInvolucrados();
                    $datcriteriomedidainvol->idcriteriomedida
                        = $criteriomedidainv[0];
                    $datcriteriomedidainvol->idinvolucrado
                        = $criteriomedidainv[1];
                    $datcriteriomedidainvol->llaveinvolucrado
                        = $criteriomedidainv[2];
                    $datcriteriomedidainvol->save();
                }
            }
        }
    }

    public function ImportarRelacionArcPlanObjetivo($db)
    {
        $sql
            = "SELECT  *
                FROM dat_arc_dat_plan_objetivo";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        $objarcplanobj = new DatArcDatPlanObjetivo();
        if (isset($result[0])) {
            foreach ($result as $key => $arcplanobj) {
                $existe = $objarcplanobj->ObtenerRelacionPlanArcObj(
                    $arcplanobj[0], $arcplanobj[1], $arcplanobj[2]
                );
                if (!isset($existe[0])) {
                    $datarcdatplanobjetivo = new DatArcDatPlanObjetivo();
                    $datarcdatplanobjetivo->idplan = $arcplanobj[0];
                    $datarcdatplanobjetivo->idarc = $arcplanobj[1];
                    $datarcdatplanobjetivo->idobjetivo = $arcplanobj[2];
                    $datarcdatplanobjetivo->idautor = $arcplanobj[3];
                    $datarcdatplanobjetivo->save();
                }
            }
        }
    }

    public function ImportarRelacionArcPlanActividades($db)
    {
        $sql
            = "SELECT  *
                FROM dat_arc_dat_plan_actividades";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $obj = new DatArcDatPlanActividades();
        if (isset($result[0])) {
            foreach ($result as $key => $arcplanact) {
                $existe = $obj->ObtenerRelacionPlanArcAct(
                    $arcplanact[0], $arcplanact[1], $arcplanact[2]
                );
                if (!isset($existe[0])) {
                    $datarcdatplanact = new DatArcDatPlanActividades();
                    $datarcdatplanact->idarc = $arcplanact[1];
                    $datarcdatplanact->idplan = $arcplanact[0];
                    $datarcdatplanact->idactividad = $arcplanact[2];
                    $datarcdatplanact->idautor = $arcplanact[3];
                    $datarcdatplanact->save();
                }
            }
        }
    }

    public function ImportarInvolucradosPorElemento($db)
    {
        $sql
            = "SELECT  *
                FROM dat_elementos_dat_involucrados";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        $objinvol = new DatInvolucrados();
        $objeleminvol = new DatElementosDatInvolucrados();
        if (isset($result[0])) {
            foreach ($result as $key => $involelemento) {
                $existeinvol = $objinvol->ExisteInvolucrado($involelemento[0]);
                if (isset($existeinvol[0])) {
                    $existelminvol = $objeleminvol->ExisteInvolucrado(
                        $involelemento[0], $involelemento[1]
                    );
                    if (!isset($existelminvol[0])) {
                        $datelemdatinvol = new DatElementosDatInvolucrados();
                        $datelemdatinvol->idelemento = $involelemento[0];
                        $datelemdatinvol->idinvolucrado = $involelemento[1];
                        $datelemdatinvol->llaveinvolucrado = $involelemento[2];
                        $datelemdatinvol->save();
                    }
                }
            }
        }
    }

    public function ImportarNomNomencladoresPorElementos($db)
    {
        $sql
            = "SELECT  *
                FROM dat_elementos_nom_nomenclador";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        $objelemnom = new DatElementosNomNomenclador();
        if (isset($result[0])) {
            foreach ($result as $key => $nomelemento) {
                $existenom = $this->pIntegrator->existeNomencladorSegunId(
                    $nomelemento[1]
                );
                if (isset($existenom[0])) {
                    $existeelemnom = $objelemnom->ExisteElem_Nom(
                        $nomelemento[0], $nomelemento[1]
                    );
                    if (!$existeelemnom) {
                        $datelemnom = new DatElementosNomNomenclador();
                        $datelemnom->idelemento = $nomelemento[0];
                        $datelemnom->idnomenclador = $nomelemento[1];
                        $datelemnom->tiponomenclador = $nomelemento[2];
                        $datelemnom->save();
                    }
                }
            }
        }
    }

    public function ImportarRelacionEntreElementos($db)
    {
        $sql
            = "SELECT  *
                FROM dat_elementos_dat_elementos";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        $objelemelem = new DatElementosDatElementos();
        if (isset($result[0])) {
            foreach ($result as $elemelemento) {
                $existe = $objelemelem->BuscarPadreHijo(
                    $elemelemento[0], $elemelemento[1]
                );
                if (!isset($existe[0])) {
                    $datelemdatelem = new DatElementosDatElementos();
                    $datelemdatelem->idelementopadre = $elemelemento[0];
                    $datelemdatelem->idelementohijo = $elemelemento[1];
                    $datelemdatelem->origen = $elemelemento[2];
                    $datelemdatelem->idautor = $elemelemento[3];
                    $datelemdatelem->nivelrelacion = $elemelemento[4];
                    $datelemdatelem->save();
                }
            }
        }
    }

    public function ImportarInvolucradosPorArc($db)
    {
        $sql
            = "SELECT  *
                FROM dat_arc_dat_involucrados";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        $objinvol = new DatInvolucrados();
        $objarcinvol = new DatArcDatInvolucrados();
        if (isset($result[0])) {
            foreach ($result as $key => $involarc) {
                $existeinvol = $objinvol->ExisteInvolucrado($involarc[1]);
                if (isset($existeinvol[0])) {
                    $existearcinvol = $objarcinvol->ExisteElemento(
                        $involarc[0], $involarc[1]
                    );
                    if (!isset($existearcinvol[0])) {
                        $datarcdatinvol = new DatArcDatInvolucrados();
                        $datarcdatinvol->idarc = $involarc[0];
                        $datarcdatinvol->idinvolucrado = $involarc[1];
                        $datarcdatinvol->llaveinvolucrado = $involarc[2];
                        $datarcdatinvol->save();
                    }
                }
            }
        }
    }

    public function ImportarRelacionArcPlan($db)
    {
        $sql
            = "SELECT  *
                FROM dat_arc_dat_plan";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        $obj = new DatArcDatPlan();
        if (isset($result[0])) {
            foreach ($result as $key => $planarc) {
                $existe = $obj->ExisteArea_Plan($planarc[0], $planarc[1]);
                if (!isset($existe[0])) {
                    $objdatarcdatplan = new DatArcDatPlan();
                    $objdatarcdatplan->idarc = $planarc[0];
                    $objdatarcdatplan->idplan = $planarc[1];
                    $objdatarcdatplan->idautorrelacion = $planarc[2];
                    $objdatarcdatplan->save();
                }
            }
        }
    }

    public function ImportarCriteriosMedida($db)
    {
        $sql
            = "SELECT  *
                FROM dat_criteriomedida   
                WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $key => $criteriomedida) {
                $datcriteriomedida = new DatCriteriomedida();
                $datcriteriomedida->idumedida = $criteriomedida[1];
                $datcriteriomedida->idobjetivo = $criteriomedida[2];
                $datcriteriomedida->idestadocump = $criteriomedida[3];
                $datcriteriomedida->dencriterio = $criteriomedida[4];
                $datcriteriomedida->fechainicio = $criteriomedida[5];
                $datcriteriomedida->fechafin = $criteriomedida[6];
                $datcriteriomedida->valormeta = $criteriomedida[7];
                $datcriteriomedida->valoreal = $criteriomedida[8];
                $datcriteriomedida->participante = $criteriomedida[9];
                $datcriteriomedida->descriterio = $criteriomedida[10];
                $datcriteriomedida->gradocumplimiento = $criteriomedida[11];
                $datcriteriomedida->estadocumplimiento = $criteriomedida[12];
                $datcriteriomedida->idusuariocrea = $criteriomedida[13];
                $datcriteriomedida->save();
                $datcriteriomedida->idcriteriomedida = $criteriomedida[0];
                $datcriteriomedida->save();
            }
        }
    }

    //**************** Sobrescribir Inf Repetida (true)*********************//  

    private function sobrescribirEnDatElementos(
        $db, $tipoelemento, $arrayIdElemInsert
    ) {
        $sql
            = "SELECT  *
                FROM dat_elementos                   
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $elemento) {
                $datoselemento = new DatElementos();
                $datoselemento->idelemento = $elemento[0];
                $datoselemento->idtipoelemento = $elemento[1];
                $datoselemento->denelemento = $elemento[2];
                $datoselemento->descelemento = $elemento[3];
                $datoselemento->idusuariocrea = $elemento[4];
                $datoselemento->llevahistorial = $elemento[5];
                $datoselemento->activo = $elemento[6];
                $datoselemento->gradocumplimiento = $elemento[7];
                $datoselemento->privado = $elemento[8];
                $datoselemento->participante = $elemento[9];
                $datoselemento->idestadoaprob = $elemento[10];
                $datoselemento->estadocumplimiento = $elemento[11];
                $datoselemento->dirigente = $elemento[12];
                $datoselemento->ActualizarInfElemento();
                if ($datoselemento->idtipoelemento == $tipoelemento) {
                    $arrayIdElemInsert[] = $datoselemento->idelemento;
                }
            }
        }
        $this->sobrescribirEnDatPlan($db);
        $this->sobrescribirEnDatObjetivos($db);
        $this->sobrescribirEnDatCriterioMedida($db);
        $this->sobrescribirEnDatFip($db);
        $this->sobrescribirEnDatActividades($db);
        return $arrayIdElemInsert;
    }

    private function sobrescribirEnDatPlan($db)
    {
        $sql
            = "SELECT  *
                FROM dat_plan_pdo  
                INNER JOIN  dat_elementos ON idelemento = idplan 
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $plan) {
                $datplan = new DatPlanPdo();
                $datplan->fechainicio = $plan[1];
                $datplan->fechafin = $plan[2];
                $datplan->idplan = $plan[0];
                $datplan->ActualizarInfPlan();
            }
        }
    }

    private function sobrescribirEnDatObjetivos($db)
    {
        $sql
            = "SELECT  *
                FROM dat_objetivo 
                INNER JOIN  dat_elementos ON idelemento = idobjetivo 
                WHERE nuevo = 0 ";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $objetivo) {
                $datobjetivo = new DatObjetivo();
                $datobjetivo->fechainicio = $objetivo[1];
                $datobjetivo->fechafin = $objetivo[2];
                $datobjetivo->idobjetivo = $objetivo[0];
                $datobjetivo->ActualizarInfObjetivo();
            }
        }
    }

    private function sobrescribirEnDatActividades($db)
    {
        $sql
            = "SELECT  *
                FROM dat_actividades  
                INNER JOIN  dat_elementos  ON idelemento = idactividad 
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $actividad) {
                $datact = new DatActividades();
                $datact->idactividad = $actividad[0];
                $datact->tiporepeticion = $actividad[1];
                $datact->fechainicio = $actividad[2];
                $datact->fechafin = $actividad[3];
                $datact->horainicio = $actividad[4];
                $datact->horafin = $actividad[5];
                $datact->lugar = $actividad[6];
                $datact->esprincipal = $actividad[7];
                $datact->ActualizarInfActividad();
            }
        }
    }

    private function sobrescribirEnDatCriterioMedida($db)
    {
        $sql
            = "SELECT  *
                FROM dat_criteriomedida   
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $criterio) {
                $datcriteriomedida = new DatCriteriomedida();
                $datcriteriomedida->idcriteriomedida = $criterio[0];
                $datcriteriomedida->idumedida = $criterio[1];
                $datcriteriomedida->idobjetivo = $criterio[2];
                $datcriteriomedida->idestadocump = $criterio[3];
                $datcriteriomedida->dencriterio = $criterio[4];
                $datcriteriomedida->fechainicio = $criterio[5];
                $datcriteriomedida->fechafin = $criterio[6];
                $datcriteriomedida->valormeta = $criterio[7];
                $datcriteriomedida->valoreal = $criterio[8];
                $datcriteriomedida->participante = $criterio[9];
                $datcriteriomedida->descriterio = $criterio[10];
                $datcriteriomedida->gradocumplimiento = $criterio[11];
                $datcriteriomedida->estadocumplimiento = $criterio[12];
                $datcriteriomedida->idusuariocrea = $criterio[13];
                $datcriteriomedida->ActualizarInfCriterioM();
            }
        }
    }

    private function sobrescribirEnDatFip($db)
    {
        $sql
            = "SELECT  *
                FROM dat_fip  
                INNER JOIN  dat_elementos ON idelemento = idfip 
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $fip) {
                $datfip = new DatFip();
                $datfip->emite = $fip[1];
                $datfip->fechaemision = $fip[2];
                $datfip->fechacumplimiento = $fip[3];
                $datfip->fechacumplio = $fip[4];
                $datfip->numfip = $fip[5];
                $datfip->documentorigen = $fip[6];
                $datfip->idfip = $fip[0];
                $datfip->ActualizarInfFip();
            }
        }
    }

    private function sobrescribirEnDatArc(
        $db, $tipoelemento, $arrayIdElemInsert
    ) {
        $sql
            = "SELECT  *
                FROM dat_arc   
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $arc) {
                $datarc = new DatArc();
                $datarc->denarc = $arc[4];
                $datarc->descrip = $arc[5];
                $datarc->idusuariocrea = $arc[6];
                $datarc->fechacreacion = $arc[7];
                $datarc->fechainicio = $arc[8];
                $datarc->fechafin = $arc[9];
                $datarc->activo = $arc[10];
                $datarc->caduca = $arc[11];
                $datarc->idarc = $arc[0];
                $datarc->idarcp = $arc[1];
                $datarc->ActualizarInfArc();
                if ($tipoelemento == 5) {
                    $arrayIdElemInsert[] = $datarc->idarc;
                }
            }
        }
        return $arrayIdElemInsert;
    }

}
