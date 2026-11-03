<?php

/**
 * @author    Equipo Desarrollo
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementos extends BaseDatElementos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipoelemento', array('local' => 'idelemento', 'foreign' => 'idtipoelemento')
        );
        $this->hasMany(
            'DatElementosDatElementos', array('local' => 'idelemento', 'foreign' => 'idelementopadre')
        );
        $this->hasOne(
            'DatElementosDatElementos', array('local' => 'idelemento', 'foreign' => 'idelementohijo')
        );
        $this->hasOne(
            'DatPlanPdo', array('local' => 'idelemento', 'foreign' => 'idplan')
        );
        $this->hasOne(
            'DatFip', array('local' => 'idelemento', 'foreign' => 'idfip')
        );
        $this->hasOne(
            'DatObjetivo', array('local' => 'idelemento', 'foreign' => 'idobjetivo')
        );
        $this->hasOne(
            'DatActividades', array('local' => 'idelemento', 'foreign' => 'idactividad')
        );
        $this->hasOne(
            'DatDesviacion', array('local' => 'idelemento', 'foreign' => 'iddesviacion')
        );
        $this->hasMany(
            'DatElementosDatInvolucrados', array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
        $this->hasMany(
            'DatElementosNomNomenclador', array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
        $this->hasMany(
            'DatFechaControl', array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
    }

    public function Buscar($idelemento)
    {
        $elemento = Doctrine::getTable('DatElementos')->find($idelemento);
        return $elemento;
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos')->limit($limite = 10)->offset(
            $inicio = 0
        )->execute();
        return $result->toArray();
    }

    static public function GetPorLimiteDadoIdUsuariocrea(
        $idusuariocrea, $limite = 15, $inicio = 0
    )
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->where("e.idusuariocrea = $idusuariocrea")
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();
    }

    public function GetFits($limite = 5, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos')->where("idtipoelemento = 2")
            ->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function GetCantidadFips()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos')->where("idtipoelemento = 2")
            ->execute()->count();
        return $result;
    }

    public function DameElementosDadoIdusuariocreayTipo(
        $idusuariocrea, $idtipoelemento
    )
    {
        if ($idtipoelemento == 3) {
            $origen = 4;
            $query = new Doctrine_Query();
            $result = $query
                ->from('DatElementos e')
                ->where(
                    "e.idusuariocrea = $idusuariocrea
                        AND e.idtipoelemento = $idtipoelemento"
                )
                ->execute();
            return $result->toArray();
        }
        if ($idtipoelemento != 3) {
            $origen = 4;
            $query = new Doctrine_Query();
            $result = $query
                ->from('DatElementos e')
                ->where(
                    "e.idusuariocrea = $idusuariocrea
                        AND e.idtipoelemento = $idtipoelemento"
                )
                ->execute();
            return $result->toArray();
        }
    }

    public function GetElemento($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos')->where(
            "idelemento = ?", $idelemento
        )->execute();
        return $result->toArray();
    }

    public function DameElementosdadoIdusuariocrea($idusuariocrea)
    {
        $query = new Doctrine_Query();
        $result = $query
            ->select("elem.*")
            ->from('DatElementos elem')
            ->where("elem.idusuariocrea = $idusuariocrea")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna los datos de una actividad dado el autor
     */
    public function DameElementosActividadDadoIdusuariocrea($idusuariocrea)
    {
        $query = new Doctrine_Query();
        $result = $query
            ->select("elem.*,act.*")
            ->from('DatElementos elem')
            ->innerJoin('elem.DatActividades act')
            ->where("elem.idusuariocrea = $idusuariocrea")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna los datos de una actividad
     */
    static public function DameDatosActividadDadoIdactividad($idactividad)
    {
        $query = new Doctrine_Query();
        $result = $query->select("*")
            ->select('e.*,a.*')
            ->from('DatElementos e,e.DatActividades a ')
            ->where("e.idelemento = $idactividad")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna actividades por diferentes criterios
     */
    public function GetActvPorUsuarioTipoNomenclador(
        $idusuariocrea, $tiponom, $fechainicio, $fechafin
    )
    {
        $query = new Doctrine_Query();
        $result = $query->select("*")
            ->from('DatElementos elem,DatActividades act, DatVariable var')
            ->innerJoin('elem.DatActividades act')
            ->innerJoin('act.DatVariable var')
            ->innerJoin('elem.DatElementosNomNomenclador elemnom')
            ->where("elem.idusuariocrea = $idusuariocrea")
            ->addWhere("var.fechainicio >= $fechainicio")
            ->addWhere("var.fechafin <= $fechafin")
            ->addWhere("elemnom.tiponomenclador = $tiponom")
            ->execute();
        return $result->toArray();
    }

    /**
     * Consulta que retorna objetivos registrados por un usuario
     */
    public function GetObjetivosRegPorUsuario($idUsuarioSesion)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatObjetivo o')
            ->innerJoin('o.DatElementos e')
            ->where("e.idusuariocrea = ?", $idUsuarioSesion)
            ->execute()
            ->toArray();
        die(bd); //punto de prueba
        return $result;
    }

    /**
     * Consulta que retorna el primer elemento que encuentra con un determinado nombre
     */
    public function ExisteNombreElemento($idusuariocrea, $denelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->where("e.denelemento =?", $denelemento)
            ->addWhere("e.idusuariocrea =?", $idusuariocrea)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result[0];
    }

    /**
     * Consulta que retorna un array de elementos que coinciden con el nombre, y el tipo de elemento
     */
    public function ExisteElementoNombreTipo(
        $idusuariocrea, $denelemento, $tipoelemento
    )
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->where("e.denelemento =?", $denelemento)
            ->addWhere("e.idusuariocrea =?", $idusuariocrea)
            ->addWhere("e.idtipoelemento =?", $tipoelemento)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function ObtenerIncidencias($idusuariocrea, $tipoelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->where("e.idusuariocrea =?", $idusuariocrea)
            ->addWhere("e.idtipoelemento =?", $tipoelemento)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function ExisteElementoNombreTipoMod(
        $idusuariocrea, $denelemento, $tipoelemento, $idelemento
    )
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->where("e.denelemento =?", $denelemento)
            ->addWhere("e.idusuariocrea =?", $idusuariocrea)
            ->addWhere("e.idtipoelemento =?", $tipoelemento)
            ->addWhere("e.idelemento <>?", $idelemento)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que elimina una elemento dado el identificador
     */
    public function EliminarActividad($idact)
    {
        $cambiar = Doctrine::getTable('DatElementos')->find($idact);
        $cambiar->delete();
        return true;
    }

    /**
     * Consulta que cambia el estado de activacion de un elemento
     */
    public function setActivaActividad($idact, $activo)
    {
        $cambiar = Doctrine::getTable('DatElementos')->find($idact);
        $cambiar->activo = $activo;
        $cambiar->save();
        return true;
    }

    /**
     * Consulta que retorna el autor de un determinado elemento
     */
    public function usuariocreaporidelemento($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->select("e.idusuariocrea")
            ->from("DatElementos e")
            ->where('e.idelemento =?', $idelemento)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna los elementos relacionados con un determinado plan
     */
    public function GetHijosDadoIdPlan($idplan)
    {
        $query = new Doctrine_Query();
        $result = $query->select('p.*, e.*')
            ->from('DatElementos e, DatPlanPdo p')
            ->innerJoin('e.DatPlanPdo p')
            ->innerJoin('e.DatElementosDatElementos ee')
            ->where('ee.idelementopadre = ?', $idplan)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna donde quiera que un elemento este como hijo
     */
    public function GetPadreDadoIdPlan($idplan)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')
            ->where('ee.idelementohijo = ?', $idplan)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna arreglo de elementos hijos dado el elemento padre
     */
    public function EsElementoPadre($idelementopadre)
    {
        $origen = 0;
        $origenA = 3;
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->innerJoin('e.DatElementosDatElementos d')
            ->where(
                "d.idelementopadre = $idelementopadre
                    AND (d.origen = $origen OR d.origen = $origenA)"
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna las actividades que no tienen repeticiones dado el autor
     */
    public function ElemeActSinRepetPorAutor($idusuariocrea)
    {
        $origen = 0;
        $origenA = 3;
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->innerJoin('e.DatElementosDatElementos d')
            ->where(
                "e.idusuariocrea = $idusuariocrea " .
                // AND  d.idelementopadre = $idelementopadre
                " AND (d.origen = $origen OR d.origen = $origenA)"

            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna el elemento dado el identificador
     */
    public function DameElementoDadoID($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos')
            ->where("idelemento = ?", $idelemento)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return (count($result) > 0) ? $result[0] : null;
    }

    /**
     * Consulta que retorna los planes por autor
     */
    public function GetPlanesDeUsuario($idUsuario, $idElemento)
    {
        $cadena = "";
        if ($idElemento) {
            $cadena = " and dede.idelementopadre = $idElemento";
        }
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->innerJoin('e.DatPlanPdo p')
            ->leftJoin('e.DatElementosDatElementos dede')
            ->where(
                "e.idtipoelemento = 0 and e.idusuariocrea = $idUsuario"
                . $cadena
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna actividades para mostrarlas en el Calendario
     */
    public function DameActivdiadesCalendario(
        $fechai, $fechaf, $arrayinvolact, $arrayautoresact, $arraynomencladores, $arrayestados, $arrayelementosrelacionados, $parametros
    )
    {
        $cadena = "SELECT e.*,a.*,categ.color
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_actividades a 
            ON e.idelemento = a.idactividad 
            LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador encat 
            ON  (e.idelemento = encat.idelemento AND encat.tiponomenclador = 2) 
            LEFT JOIN mod_objetivos.nom_nomenclador ncat 
            ON encat.idnomenclador = ncat.idnomenclador 
            LEFT JOIN mod_objetivos.nom_categactividad categ 
            ON ncat.idnomenclador = categ.idnomenclador ";
        $cadenaautoresinvol = '';
        if (isset($arrayautoresact[0])) {
            $cadenaautoresinvol = " AND ((";
            $totalaut = count($arrayautoresact);
            $operator = " OR "; //OR
            foreach ($arrayautoresact as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (e.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if (isset($arrayinvolact[0])) {
                $cadenaautoresinvol .= " AND "; /* " OR "; */
            } else {
                $cadenaautoresinvol .= ")";
            }
        }
        //print_r($cadenaautoresinvol);die;
        //cadena sql con involucrados para sentencia final
        if (isset($arrayinvolact[0])) {
            $cadena
                .= " INNER JOIN mod_objetivos.dat_elementos_dat_involucrados
                ei ON ei.idelemento = e.idelemento ";
            if (!$arrayautoresact[0]) {
                $cadenaautoresinvol .= " AND ";
            }
            $cadenaautoresinvol .= " (";
            $totalinvol = count($arrayinvolact);

            $operator = " OR "; //OR
            foreach ($arrayinvolact as $key => $invol) {
                $llaveinvolucrado = $invol['llaveinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (ei.llaveinvolucrado = '$llaveinvolucrado') "
                    . $operator;
            }

            $cadenaautoresinvol .= ") OR (";

            $operator = " OR "; //OR
            foreach ($arrayinvolact as $key => $invol) {
                $llaveinvolucrado = $invol['llaveinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (ei.llaveinvolucrado = '$llaveinvolucrado') "
                    . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if ($arrayautoresact[0]) {
                $cadenaautoresinvol .= ")";
            }
        }
        $cadenanom = "";
        if (isset($arraynomencladores[0]['idnomenclador'])) {
            $cadena
                .= " INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador
                en ON en.idelemento = e.idelemento ";
            $cadenanom .= " AND (";
            $totalnom = count($arraynomencladores);
            $operator = " OR ";
            foreach ($arraynomencladores as $key => $nom) {
                $idnomenclador = $nom['idnomenclador'];
                if ($key == $totalnom - 1) {
                    $operator = " ";
                }
                $cadenanom .= " (en.idnomenclador = '$idnomenclador') "
                    . $operator;
            }
            $cadenanom .= ")";
        }
        $cadenaestados = "";
        if (isset($arrayestados[0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (e.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ") ";
        }
        if (isset($arrayelementosrelacionados[0])) {
            $cadenarelacion .= "(";
            //$inneree = 0;
            //$innerapa = 0;
            $existetipoelCicta = 0;
            $existereldifCicta = 0;
            foreach (
                $arrayelementosrelacionados as $key => $elementorelacionado
            ) {
                if ($elementorelacionado->tipoelemento == 50) {
                    $existetipoelCicta = 1;
                    $idarc = $elementorelacionado->idarc;
                    $idplan = $elementorelacionado->idplan;
                    if ($key != 0) {
                        $cadenarelacion .= " OR ";
                    }
                    $cadenarelacion
                        .= " (apa.idarc = '$idarc'
                        AND apa.idplan = '$idplan') ";
                } else {
                    $existereldifCicta = 1;
                    $idelementopadre = $elementorelacionado->idplan;
                    if ($elementorelacionado->tipoelemento == 1) {
                        $idelementopadre = $elementorelacionado->idobjetivo;
                    }
                    if ($elementorelacionado->tipoelemento == 2) {
                        $idelementopadre = $elementorelacionado->idfip;
                    }
                    if ($key != 0) {
                        $cadenarelacion .= " OR ";
                    }
                    $cadenarelacion .= " (ee.idelementopadre = '$idelementopadre') ";
                }
            }
            $muletilla = ' INNER ';
            if ($existetipoelCicta && $existereldifCicta) {
                $muletilla = ' LEFT ';
            }
            if ($existetipoelCicta) {
                $cadena .= $muletilla
                    . "JOIN mod_objetivos.dat_arc_dat_plan_actividades apa
                        ON apa.idactividad = a.idactividad ";
            }
            if ($existereldifCicta) {
                $cadena .= $muletilla
                    . "JOIN mod_objetivos.dat_elementos_dat_elementos ee
                        ON e.idelemento = ee.idelementohijo ";
            }
            $cadenarelacion .= ")";
            $cadena .= " WHERE ";
            $cadena .= $cadenarelacion;
        } else {
            $cadena
                .= " WHERE e.idtipoelemento = '3' ";
        }

        $cadena .= $cadenaautoresinvol . $cadenanom
            . $cadenaestados;
        if ($fechai != null && $fechaf != null) {
            $cadena
                .= " AND((a.fechainicio >= '$fechai'
                and a.fechainicio <= '$fechaf') OR (a.fechafin >= '$fechai' 
                and a.fechafin <= '$fechaf') OR (a.fechainicio <= '$fechai' 
                and a.fechafin >= '$fechaf')) ";
        }
        if ($parametros->estadoaprobacion) {
            $cadena .= " AND e.idestadoaprob = '$parametros->estadoaprobacion' ";
        }

        if ($parametros->car) {
            $cadena .= " AND e.idelemento || '' LIKE '%$parametros->car%' ";
        }

        if ($parametros->den) {
          $cadena .= " AND  e.denelemento LIKE '%$parametros->den%' ";
        }

        $cadena .= ' GROUP BY e.idelemento,a.idactividad,categ.color';
        $cadena .= ' ORDER BY a.fechainicio, a.horainicio';

        $connA = Doctrine_Manager:: connection();

//        echo $cadena;die;
        //print_r($cadena);die;

        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Consulta que retorna actividades para cargarlas  en el grid de Gestionar Actividades
     */
    public function ObtenerActividadesGrid(
        /* $idusuariosession, */
        $fechainiciob, $fechafinb, $denominacionb, $arrayautoresact, $arrayinvolact, /* $idtipoelemento, */
        $idtipoelementopadre, $idelementopadre, $fechainicioelemento, $fechafinelemento, $arrayestados, /* $estaaprobando, */
        $limit, $offset, /* $operloggeneral, */
        /* $operlogautinvol, */
        $tfcar
    )
    {
        $connA = Doctrine_Manager:: connection();
        $cadenaautoresinvolrep = $this->ObtenerCadenaDeAutoresInvolucrados(
            'r', $arrayautoresact, $arrayinvolact
        );
        $cadenaautoresinvol = $this->ObtenerCadenaDeAutoresInvolucrados(
            'e', $arrayautoresact, $arrayinvolact
        );
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = '  ';
        if (isset($arrayestados['data'][0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados['data']);
            foreach ($arrayestados['data'] as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (e.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ") ";
        }
        //empiezo a construir query generel obtener repeticiones de la actividad
        $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
            ON r.idelemento = eer.idelementohijo
            LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eir 
            ON r.idelemento = eir.idelemento
            WHERE eer.origen = '4' " . $cadenaautoresinvolrep;
        //query con sintaxis general a usar en todos los casos
        $cadena = "SELECT distinct(e.idelemento),e.denelemento,e.descelemento,
                e.llevahistorial, e.idestadoaprob,e.estadocumplimiento,
                e.gradocumplimiento,e.activo, e.idusuariocrea AS idautor,
                e.participante AS participantes,a.fechainicio, a.fechafin  
                FROM mod_objetivos.dat_elementos e ";
        if ($idtipoelementopadre != null) {
            $cadena
                .= " INNER JOIN mod_objetivos.dat_actividades a
                ON e.idelemento = a.idactividad
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON ei.idelemento = e.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
                ON e.idelemento = ee.idelementohijo
                WHERE ee.idelementopadre = '$idelementopadre' ";
            if ($denominacionb != null) {
                $cadena .= " AND  e.denelemento LIKE '%$denominacionb%' ";
            }
            if ($fechainicioelemento != null) {
                $cadena .= " AND  a.fechainicio >= '$fechainicioelemento' ";
            }
            if ($fechafinelemento != null) {
                $cadena .= " AND  a.fechafin <= '$fechafinelemento' ";
            }
            if ($fechainiciob != null) {
                $cadena .= " AND  a.fechainicio >= '$fechainiciob' ";
            }
            if ($fechafinb != null) {
                $cadena .= " AND  a.fechafin <= '$fechafinb' ";
            }
            if ($tfcar != null) {
                $cadena .= " AND  e.idelemento = '$tfcar' ";
            }
        } else {
            //creo la cadena a utilizar en todos los casos
            $cadena
                .= " INNER JOIN mod_objetivos.dat_actividades a
                ON a.idactividad = e.idelemento";
            $cadena
                .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                ei ON e.idelemento = ei.idelemento ";
            $cadena .= " WHERE e.idtipoelemento = '3'";
            if ($denominacionb != null) {
                $cadena .= " AND e.denelemento LIKE '%$denominacionb%'  ";
            }
            if ($fechainiciob != null) {
                $cadena .= " AND a.fechainicio >= '$fechainiciob'  ";
            }
            if ($fechafinb != null) {
                $cadena .= " AND a.fechafin <= '$fechafinb'  ";
            }
            if ($tfcar != null) {
                $cadena .= " AND  e.idelemento = '$tfcar' ";
            }
        }
        $cadena .= $cadenaautoresinvol . $cadenaestados;
        $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion
            . ") AND e.idelemento NOT IN (" . $cadenadescendencia
            . ")";
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll(PDO::FETCH_ASSOC);
        $total = count($resultnopag);
        if ($offset == null) {
            $offset = 0;
        }
        $cadena .= " OFFSET(" . $offset . ") LIMIT(" . $limit . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultado[] = $total;
        $resultado[] = $result;
        return $resultado;
    }

    /**
     * Consulta que retorna actividades para mostrarlas en el reporte formato Mes
     */
    public function ObtenerActividadesPorDia(
        $arrayinvol, $fechainicio, $fechafin
    )
    {
        $cadena = "SELECT distinct * FROM mod_objetivos.dat_elementos
                INNER JOIN mod_objetivos.dat_actividades 
                ON dat_actividades.idactividad = dat_elementos.idelemento";
        $cadena
            .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
            ON dat_elementos_dat_involucrados.idelemento = dat_elementos.idelemento ";
        $cadena
            .= " WHERE dat_elementos.idtipoelemento = '3' AND
		( (dat_actividades.fechainicio >= '$fechainicio' 
                    AND dat_actividades.fechainicio <= '$fechafin') 
		  OR (dat_actividades.fechafin >= '$fechainicio' 
                      AND dat_actividades.fechafin <= '$fechafin') 
		  OR (dat_actividades.fechainicio < '$fechainicio' 
                      AND dat_actividades.fechafin >= '$fechafin') 
		  OR (dat_actividades.fechainicio = '$fechainicio')) 
                      AND (";
        $totalinvol = count($arrayinvol);
        $operator = " OR ";
        foreach ($arrayinvol as $key => $invol) {
            $idinvolucrado = $invol['idinvolucrado'];
            if ($key == $totalinvol - 1) {
                $operator = " ";
            }
            $cadena .= " (dat_elementos_dat_involucrados.idinvolucrado = '$idinvolucrado') "
                . $operator;
        }
        $cadena .= ")";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerActividadesReporte1(
        $fechainicio, $fechafin, $fechainicioD, $fechafinD, $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
    )
    {
        $bandera = "LEFT";
        if ($todoscrit == 'true') {
            $bandera = "INNER";
        }
        $cadenanom = '';
        $cadenaestados = '';
        $joinnom = '';
        $joininvolaut = '';
        //cadena sql con posibles autores e involucrados
        if (isset($arrayidautor[0])) {
            $totalaut = count($arrayidautor);
            $operator = " OR ";
            foreach ($arrayidautor as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (e.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            if (isset($arrayidinvol[0])) {
                $cadenaautoresinvol .= $operador;
            }
        }
        if (isset($arrayidinvol[0])) {
            $joininvolaut = $bandera
                . " JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                    ON ei.idelemento = e.idelemento ";
            $totalinvol = count($arrayidinvol);
            $operator = " OR ";
            foreach ($arrayidinvol as $key => $invol) {
                $idinvolucrado = $invol['idinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (ei.idinvolucrado = '$idinvolucrado') "
                    . $operator;
            }
        }
        //cadena sql con los estados en que puedo ver el documento 		
        if (isset($arrayestados[0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (e.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        //cadena sql con los nomencladores
        if (isset($arrayidnom[0]->idnom)) {
            $joinnom = $bandera
                . " JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON e.idelemento = en.idelemento ";
            $operator = " OR ";
            $cadenanom = ' AND (';
            $totalnom = count($arrayidnom);
            foreach ($arrayidnom as $key => $nom) {
                $idomenclador = $nom->idnom;
                if ($key == $totalnom - 1) {
                    $operator = " ";
                }
                $cadenanom .= " (en.idnomenclador = '$idomenclador') "
                    . $operator;
            }
            $cadenanom .= ")";
        }
        //empiezo a construir query generel obtener repeticiones de la actividad
        $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
            ON r.idelemento = eer.idelementohijo
            LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eir 
            ON r.idelemento = eir.idelemento
            WHERE eer.origen = '4' ";
        $cadena = "SELECT distinct(e.idelemento),e.denelemento,
                e.dirigente AS dirigentes,e.participante AS participantes,
                a.fechainicio,a.fechafin,a.lugar,a.esprincipal,a.horainicio,
                a.horafin
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_actividades a 
            ON a.idactividad = e.idelemento ";
        if ($idplan != null) {
            $cadena
                .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON e.idelemento = ee.idelementohijo 
                AND ee.idelementopadre  = '$idplan' ";
            $cadena .= $joinnom . $joininvolaut
                . " WHERE e.idtipoelemento = '3' ";
            if ($fechainicio != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicio'
                    AND a.fechafin >= '$fechainicio') ";
                if ($fechafin != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafin'
                        AND a.fechafin >= '$fechafin')								
                        OR (a.fechainicio >= '$fechainicio' 
                            AND a.fechafin <= '$fechafin')";
                }
                $cadena .= ")";
            }
            if ($fechafin != null && $fechainicio == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')";
            }
            if ($fechainicioD != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicioD'
                    AND a.fechafin >= '$fechainicioD') ";
                if ($fechafinD != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafinD'
                        AND a.fechafin >= '$fechafinD')
                    OR (a.fechainicio >= '$fechainicioD' 
                        AND a.fechafin <= '$fechafinD')";
                }
                $cadena .= ")";
            }
            if ($fechafinD != null && $fechainicioD == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechainicioD')";
            }
            if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
                $cadena .= " AND (" . $cadenaautoresinvol . ")";
            }
            $cadena .= $cadenaestados;
            $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
            $cadena .= " UNION ";
            $cadena
                .= " SELECT distinct(e.idelemento),e.denelemento,
                e.dirigente AS dirigentes, e.participante AS participantes,
                a.fechainicio,a.fechafin,a.lugar,a.esprincipal,a.horainicio,
                a.horafin
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON a.idactividad = e.idelemento 
                INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apa 
                ON apa.idactividad = e.idelemento 
                AND apa.idplan = '$idplan' ";
            $cadena .= $joinnom . $joininvolaut
                . " WHERE e.idtipoelemento = '3' ";
            if ($fechainicio != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicio'
                    AND a.fechafin >= '$fechainicio') ";
                if ($fechafin != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafin'
                        AND a.fechafin >= '$fechafin')
                        OR (a.fechainicio >= '$fechainicio' 
                            AND a.fechafin <= '$fechafin')";
                }
                $cadena .= ")";
            }
            if ($fechafin != null && $fechainicio == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')";
            }
            if ($fechainicioD != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicioD'
                    AND a.fechafin >= '$fechainicioD') ";
                if ($fechafinD != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafinD'
                        AND a.fechafin >= '$fechafinD')
                        OR (a.fechainicio >= '$fechainicioD' 
                            AND a.fechafin <= '$fechafinD')";
                }
                $cadena .= ")";
            }
            if ($fechafinD != null && $fechainicioD == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechainicioD')";
            }
            if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
                $cadena .= " AND (" . $cadenaautoresinvol . ")";
            }
            $cadena .= $cadenaestados;
            $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
            $cadena .= " UNION ";
            $cadena
                .= " SELECT distinct(e.idelemento),e.denelemento,
                e.dirigente AS dirigentes, e.participante AS participantes,
                a.fechainicio,a.fechafin,a.lugar,a.esprincipal,
                a.horainicio,a.horafin
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON a.idactividad = e.idelemento 
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
                ON a.idactividad = eer.idelementohijo
                INNER JOIN mod_objetivos.dat_elementos er 
                ON er.idelemento = eer.idelementopadre
                INNER JOIN mod_objetivos.dat_objetivo o 
                ON er.idelemento = o.idobjetivo 
                INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo 
                ON apo.idobjetivo = o.idobjetivo AND apo.idplan = '$idplan' ";
            $cadena .= $joinnom . $joininvolaut
                . " WHERE e.idtipoelemento = '3' ";
            if ($fechainicio != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicio'
                    AND a.fechafin >= '$fechainicio') ";
                if ($fechafin != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafin'
                        AND a.fechafin >= '$fechafin')
                        OR (a.fechainicio >= '$fechainicio' 
                            AND a.fechafin <= '$fechafin')";
                }
                $cadena .= ")";
            }
            if ($fechafin != null && $fechainicio == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')";
            }
            if ($fechainicioD != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicioD'
                    AND a.fechafin >= '$fechainicioD') ";
                if ($fechafinD != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafinD'
                        AND a.fechafin >= '$fechafinD')
                        OR (a.fechainicio >= '$fechainicioD' 
                            AND a.fechafin <= '$fechafinD')";
                }
                $cadena .= ")";
            }
            if ($fechafinD != null && $fechainicioD == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechainicioD')";
            }
            if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
                $cadena .= " AND (" . $cadenaautoresinvol . ")";
            }
            $cadena .= $cadenaestados;
            $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
        } else {
            $cadena .= $joinnom . $joininvolaut
                . " WHERE e.idtipoelemento = '3' ";
            if ($fechainicio != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicio'
                    AND a.fechafin >= '$fechainicio') ";
                if ($fechafin != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafin'
                        AND a.fechafin >= '$fechafin')
                        OR (a.fechainicio >= '$fechainicio' 
                            AND a.fechafin <= '$fechafin')";
                }
                $cadena .= ")";
            }
            if ($fechafin != null && $fechainicio == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')";
            }
            if ($fechainicioD != null) {
                $cadena
                    .= " AND ( (a.fechainicio <= '$fechainicioD'
                    AND a.fechafin >= '$fechainicioD') ";
                if ($fechafinD != null) {
                    $cadena
                        .= " OR (a.fechainicio <= '$fechafinD'
                        AND a.fechafin >= '$fechafinD')
                        OR (a.fechainicio >= '$fechainicioD' 
                            AND a.fechafin <= '$fechafinD')";
                }
                $cadena .= ")";
            }
            if ($fechafinD != null && $fechainicioD == null) {
                $cadena
                    .= " AND (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechainicioD')";
            }
            if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
                $cadena .= " AND (" . $cadenaautoresinvol . ")";
            }
            $cadena .= $cadenaestados;
            $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
        }
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerActividadesVinculadasARCPlan($idplan, $idarc, $datos)
    {
        $cadenaestados = "";
        $cadenanom = '';
        $joinnom = '';
        $joininvolaut = '';
        $cadenaautoresinvol = '';
        $arrayestados = implode(',', $datos->arrayestados);
        $arrayidautores = implode(',', $datos->arrayidautores);
        $arrayidinvolucrados = implode(',', $datos->arrayidinvolucrados);
        $arrayidnom = implode(',', $datos->arrayidnom);
        $fechainicio = $datos->fechainicio;
        $fechafin = $datos->fechafin;
        $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
        $fechafinD = $datos->arraydatosreporte['fechafinD'];
        if (isset($arrayidautores[0]) || isset($arrayidinvolucrados[0])) {
            if (isset($arrayidautores[0])) {
                $cadenaautoresinvol = " AND (e.idusuariocrea IN (" . $arrayidautores . ")";
                if (isset($arrayidinvolucrados[0])) {
                    $cadenaautoresinvol .= " OR ";
                }
            }
            if (isset($arrayidinvolucrados[0])) {
                if (!isset($arrayidautores[0])) {
                    $cadenaautoresinvol = " AND ";
                }
                $joininvolaut = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                        ON ei.idelemento = e.idelemento ";
                $cadenaautoresinvol
                    .= " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
            }
            $cadenaautoresinvol .= (isset($arrayidautores[0])) ? ")" : "";
        }
        if (isset($arrayestados[0])) {
            $cadenaestados .= " AND e.idestadoaprob IN (" . $arrayestados . ")";
        }
        //cadena sql con los nomencladores  	   		   	
        if (isset($arrayidnom[0])) {
            $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON e.idelemento = en.idelemento ";
            $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
        }
        if ($fechainicio != null) {
            $wherfecha
                .= " AND ( (a.fechainicio <= '$fechainicio'
                AND a.fechafin >= '$fechainicio') ";
            if ($fechafin != null) {
                $wherfecha
                    .= " OR (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')
                    OR (a.fechainicio >= '$fechainicio' 
                        AND a.fechafin <= '$fechafin')";
            }
            $wherfecha .= ")";
        }
        if ($fechafin != null && $fechainicio == null) {
            $wherfecha
                .= " AND (a.fechainicio <= '$fechafin'
                AND a.fechafin >= '$fechafin')";
        }
        if ($fechainicioD != null) {
            $wherfecha
                .= " AND ( (a.fechainicio <= '$fechainicioD'
                AND a.fechafin >= '$fechainicioD') ";
            if ($fechafinD != null) {
                $wherfecha
                    .= " OR (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechafinD')
                    OR (a.fechainicio >= '$fechainicioD' 
                        AND a.fechafin <= '$fechafinD')";
            }
            $wherfecha .= ")";
        }
        if ($fechafinD != null && $fechainicioD == null) {
            $wherfecha
                .= " AND (a.fechainicio <= '$fechafinD'
                AND a.fechafin >= '$fechafinD')";
        }
        $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
            ON r.idelemento = eer.idelementohijo
            LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eir 
            ON r.idelemento = eir.idelemento
            WHERE eer.origen = '4' ";
        $cadena = "SELECT distinct(e.idelemento),e.denelemento,e.dirigente AS dirigentes,
                e.participante AS participantes,a.fechainicio,a.fechafin,
                a.lugar,a.esprincipal, a.horainicio,a.horafin
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON (a.idactividad = e.idelemento AND a.suspendida=0)  ";
        if ($idarc == 'arc') {
            $cadena
                .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON e.idelemento = ee.idelementohijo 
                AND ee.idelementopadre  = '$idplan'
                " . $joininvolaut . " " . $joinnom . "
                WHERE e.idtipoelemento = '3' " . $cadenaautoresinvol
                . " " . $cadenanom . " ";
            $cadena .= $cadenaestados;
            $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
        } else {
            $cadena = " SELECT distinct(e.idelemento),e.denelemento,
                e.dirigente AS dirigentes, e.participante AS participantes,
                a.fechainicio,a.fechafin,a.lugar,a.esprincipal,
                a.horainicio,a.horafin
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON (a.idactividad = e.idelemento AND a.suspendida=0) 
                INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apa 
                ON apa.idactividad = e.idelemento AND apa.idplan = '$idplan' 
                    AND apa.idarc = '$idarc' 
                " . $joininvolaut . " " . $joinnom . "
                WHERE e.idtipoelemento = '3' " . $cadenaautoresinvol
                . " " . $cadenanom . " ";
            $cadena .= $cadenaestados . $wherfecha;
            $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
            $cadena .= " UNION ";
            $cadena
                .= " SELECT distinct(e.idelemento),e.denelemento,
                e.dirigente AS dirigentes, e.participante AS participantes,
                a.fechainicio,a.fechafin,a.lugar,a.esprincipal,
                a.horainicio,a.horafin
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON (a.idactividad = e.idelemento AND a.suspendida=0) 
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
                ON a.idactividad = eer.idelementohijo
                INNER JOIN mod_objetivos.dat_elementos er 
                ON er.idelemento = eer.idelementopadre
                INNER JOIN mod_objetivos.dat_objetivo o 
                ON er.idelemento = o.idobjetivo 
                INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo 
                ON apo.idobjetivo = o.idobjetivo AND apo.idplan = '$idplan' 
                    AND apo.idarc = '$idarc'
                " . $joininvolaut . " " . $joinnom . "
                WHERE e.idtipoelemento = '3' " . $cadenaautoresinvol
                . " " . $cadenanom . " ";
            $cadena .= $cadenaestados . $wherfecha;
            $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
        }
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerActividadesReportePorDias(
        $fechainicio, $fechafin, /* $fechainicioD, $fechafinD, */
        $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
    )
    {
        $cadenaautoresinvol = ' ';
        //cadena sql con posibles autores
        if (isset($arrayidautor[0])) {
            $totalaut = count($arrayidautor);
            $operator = " OR ";
            foreach ($arrayidautor as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            if (isset($arrayidinvol[0])) {
                $cadenaautoresinvol .= $operador;
            }
        }
        //cadena sql con posibles involucrados	  	 
        if (isset($arrayidinvol[0])) {
            $totalinvol = count($arrayidinvol);
            $operator = " OR ";
            foreach ($arrayidinvol as $key => $invol) {
                $idinvolucrado = $invol['idinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos_dat_involucrados.idinvolucrado = '$idinvolucrado') "
                    . $operator;
            }
        }
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = '  ';
        if (isset($arrayestados[0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (dat_elementos.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        $bandera = "LEFT";
        if ($todoscrit == 'true') {
            $bandera = "INNER";
        }
        //cadena sql con los nomencladores  
        $cadenanom = ' ';
        $joinnom = '';
        if (isset($arrayidnom[0]->idnom)) {
            $joinnom = $bandera
                . " JOIN mod_objetivos.dat_elementos_nom_nomenclador
                    ON dat_elementos.idelemento = dat_elementos_nom_nomenclador.idelemento";
            $operator = " OR ";
            $cadenanom = ' AND (';
            $totalnom = count($arrayidnom);
            foreach ($arrayidnom as $key => $nom) {
                $idomenclador = $nom->idnom;
                if ($key == $totalnom - 1) {
                    $operator = " ";
                }
                $cadenanom .= " (dat_elementos_nom_nomenclador.idnomenclador = '$idomenclador') "
                    . $operator;
            }
            $cadenanom .= ")";
        }
        $joinplan = "";
        $cadenaplan = "";
        if ($idplan != null) {
            $joinplan = $bandera
                . " JOIN mod_objetivos.dat_elementos_dat_elementos
                    ON dat_elementos.idelemento = dat_elementos_dat_elementos.idelementohijo ";
            $cadenaplan = "AND dat_elementos_dat_elementos.idelementopadre = '$idplan'";
        }
        $cadena = "SELECT distinct dat_elementos.idelemento
                FROM mod_objetivos.dat_elementos
                INNER JOIN mod_objetivos.dat_actividades 
                ON dat_actividades.idactividad = dat_elementos.idelemento ";
        $cadena .= $joinplan;
        $cadena .= $bandera
            . " JOIN mod_objetivos.dat_elementos_dat_involucrados
                ON dat_elementos_dat_involucrados.idelemento = dat_elementos.idelemento ";
        $cadena .= $joinnom;
        $cadena .= " WHERE dat_elementos.idtipoelemento = '3' " . $cadenaplan;
        if ($fechainicio != null && $fechafin != null) {
            $cadena
                .= " AND ( (dat_actividades.fechainicio >= '$fechainicio'
                AND dat_actividades.fechainicio <= '$fechafin')
                    OR (dat_actividades.fechafin >= '$fechainicio' 
                        AND dat_actividades.fechafin <= '$fechafin') 
                    OR (dat_actividades.fechainicio < '$fechainicio' 
                        AND dat_actividades.fechafin >= '$fechafin') 
                    OR (dat_actividades.fechainicio = '$fechainicio') 
                        OR (dat_actividades.fechafin = '$fechafin')) ";
        }
        if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
            $cadena .= " AND (" . $cadenaautoresinvol . ")";
        }
        $cadena .= $cadenaestados;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerActividadesPorAreas(
        $idarc, $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
    )
    {
        $cadenaautoresinvol = ' ';
        //cadena sql con posibles autores
        if (isset($arrayidautor[0])) {
            $totalaut = count($arrayidautor);
            $operator = " OR ";
            foreach ($arrayidautor as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            if (isset($arrayidinvol[0])) {
                $cadenaautoresinvol .= $operador;
            }
        }
        //cadena sql con posibles involucrados
        if (isset($arrayidinvol[0])) {
            $totalinvol = count($arrayidinvol);
            $operator = " OR ";
            foreach ($arrayidinvol as $key => $invol) {
                $idinvolucrado = $invol['idinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos_dat_involucrados.idinvolucrado = '$idinvolucrado') "
                    . $operator;
            }
        }
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = '  ';
        if (isset($arrayestados[0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (dat_elementos.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        $bandera = "LEFT";
        if ($todoscrit == 'true') {
            $bandera = "INNER";
        }
        //cadena sql con los nomencladores  
        $cadenanom = ' ';
        $joinnom = '';
        if (isset($arrayidnom[0]->idnom)) {
            $joinnom = $bandera
                . " JOIN mod_objetivos.dat_elementos_nom_nomenclador
                    ON dat_elementos.idelemento = dat_elementos_nom_nomenclador.idelemento";
            $operator = " OR ";
            $cadenanom = ' AND (';
            $totalnom = count($arrayidnom);
            foreach ($arrayidnom as $key => $nom) {
                $idomenclador = $nom->idnom;
                if ($key == $totalnom - 1) {
                    $operator = " ";
                }
                $cadenanom .= " (dat_elementos_nom_nomenclador.idnomenclador = '$idomenclador') "
                    . $operator;
            }
            $cadenanom .= ")";
        }
        $cadena = "SELECT distinct dat_objetivo.idobjetivo
            FROM mod_objetivos.dat_objetivo
                INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo 
                ON dat_arc_dat_plan_objetivo.idobjetivo = dat_objetivo.idobjetivo 
                WHERE dat_arc_dat_plan_objetivo.idarc = $idarc 
                AND dat_arc_dat_plan_objetivo.idplan = $idplan";
        $cadenaA = "SELECT * FROM mod_objetivos.dat_elementos
            INNER JOIN mod_objetivos.dat_actividades 
            ON dat_actividades.idactividad = dat_elementos.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
            ON dat_elementos_dat_elementos.idelementohijo = dat_elementos.idelemento ";
        $cadenaA .= $bandera
            . " JOIN mod_objetivos.dat_elementos_dat_involucrados
                ON dat_elementos_dat_involucrados.idelemento = dat_elementos.idelemento ";
        $cadenaA
            .= "WHERE mod_objetivos.dat_elementos_dat_elementos.idelementopadre IN ("
            . $cadena . ")";
        if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
            $cadenaA .= " AND (" . $cadenaautoresinvol . ")";
        }
        $cadenaA .= $cadenaestados;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaA);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ActividadesDirectasAlPlan(
        $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
    )
    {
        $cadenaautoresinvol = ' ';
        //cadena sql con posibles autores
        if (isset($arrayidautor[0])) {
            $totalaut = count($arrayidautor);
            $operator = " OR ";
            foreach ($arrayidautor as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            if (isset($arrayidinvol[0])) {
                $cadenaautoresinvol .= $operador;
            }
        }
        //cadena sql con posibles involucrados
        if (isset($arrayidinvol[0])) {
            $totalinvol = count($arrayidinvol);
            $operator = " OR ";
            foreach ($arrayidinvol as $key => $invol) {
                $idinvolucrado = $invol['idinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos_dat_involucrados.idinvolucrado = '$idinvolucrado') "
                    . $operator;
            }
        }
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = '  ';
        if (isset($arrayestados[0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (dat_elementos.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        $bandera = "LEFT";
        if ($todoscrit == 'true') {
            $bandera = "INNER";
        }
        //cadena sql con los nomencladores  
        $cadenanom = ' ';
        $joinnom = '';
        if (isset($arrayidnom[0]->idnom)) {
            $joinnom = $bandera
                . " JOIN mod_objetivos.dat_elementos_nom_nomenclador
                    ON dat_elementos.idelemento = dat_elementos_nom_nomenclador.idelemento";
            $operator = " OR ";
            $cadenanom = ' AND (';
            $totalnom = count($arrayidnom);
            foreach ($arrayidnom as $key => $nom) {
                $idomenclador = $nom->idnom;
                if ($key == $totalnom - 1) {
                    $operator = " ";
                }
                $cadenanom .= " (dat_elementos_nom_nomenclador.idnomenclador = '$idomenclador') "
                    . $operator;
            }
            $cadenanom .= ")";
        }
        $cadenaA = "SELECT distinct dat_elementos.idelemento
            FROM mod_objetivos.dat_elementos
            INNER JOIN mod_objetivos.dat_actividades 
            ON dat_actividades.idactividad = dat_elementos.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
            ON dat_elementos_dat_elementos.idelementohijo = dat_elementos.idelemento ";
        $cadenaA .= $bandera
            . " JOIN mod_objetivos.dat_elementos_dat_involucrados
                ON dat_elementos_dat_involucrados.idelemento = dat_elementos.idelemento ";
        $cadenaA .= "WHERE mod_objetivos.dat_elementos_dat_elementos.idelementopadre = $idplan";
        if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
            $cadenaA .= " AND (" . $cadenaautoresinvol . ")";
        }
        $cadenaA .= $cadenaestados;

        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaA);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Consulta que retorna elementos por tipo de elemento, autor y elemento padre
     */
    public function obtenerActvXUsuarioPlanTipo($idusuario, $idelem, $tipoelem)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->innerJoin('e.DatElementosDatElementos ee')
            ->where('ee.idelementopadre =?', $idelem)
            ->addWhere('e.idusuariocrea=?', $idusuario)
            ->addWhere('e.idtipoelemento=?', $tipoelem)
            ->execute();
        return $result->toArray();
    }

    /**
     * Consulta que retorna elementos por tipo de elemento, autor y elemento padre
     */
    public function obtenerObjXUsuarioPlanTipo($idusuario, $idelem, $tipoelem)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
            ->innerJoin('e.DatElementosDatElementos ee')
            ->where('ee.idelementopadre =?', $idelem)
            ->addWhere('e.idusuariocrea=?', $idusuario)
            ->addWhere('e.idtipoelemento=?', $tipoelem)
            ->execute();
        return $result->toArray();
    }

    /**
     * Consulta que actualiza el estado de aprobacion de las actividades que son repeticiones de otras
     */
    public function ActualizarEstadoAprobacionActRep(
        $idestadoaprob, $idactpadre
    )
    {
        $cadenaA = "SELECT distinct dat_elementos.idelemento
                FROM mod_objetivos.dat_elementos 
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
                ON dat_elementos.idelemento = dat_elementos_dat_elementos.idelementohijo 
                WHERE dat_elementos_dat_elementos.origen = '4' 
                AND dat_elementos_dat_elementos.idelementopadre = '$idactpadre'";
        $cadena = "UPDATE mod_objetivos.dat_elementos SET idestadoaprob ='$idestadoaprob'
    				WHERE dat_elementos.idelemento IN (" . $cadenaA
            . ")";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Consulta para obtener las actividades que fueron generadas como repeticiones
     */
    public function ObtenerRepeticionesActividad(
        $idactividad, $arrayautoresact, $arrayinvolact, $arrayestados
    )
    {
        //cadena sql con posibles autores
        $cadenaautoresinvol = "(";
        $totalaut = count($arrayautoresact);
        $operator = " OR ";
        if (isset($arrayautoresact[0])) {
            foreach ($arrayautoresact as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            $cadenaautoresinvol .= " OR ";
        }
        //cadena sql con posibles involucrados
        $totalinvol = count($arrayinvolact);
        $operator = " OR ";
        if (isset($arrayinvolact[0])) {
            foreach ($arrayinvolact as $key => $invol) {
                $idinvolucrado = $invol['idinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (dat_elementos_dat_involucrados.idinvolucrado = '$idinvolucrado') "
                    . $operator;
            }
        }
        $cadenaautoresinvol .= ")";
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = " ";
        if (isset($arrayestados[0])) {
            $cadenaestados = " AND (";
            $operator = " OR ";
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (dat_elementos.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        //empiezo a construir query 
        $cadenaA = "SELECT distinct dat_elementos.idelemento
                FROM mod_objetivos.dat_elementos 
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
                ON dat_elementos.idelemento = dat_elementos_dat_elementos.idelementohijo
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                ON dat_elementos.idelemento = dat_elementos_dat_involucrados.idelemento
                WHERE dat_elementos_dat_elementos.origen = '4'  
                AND dat_elementos_dat_elementos.idelementopadre = '$idactividad' AND "
            . $cadenaautoresinvol . $cadenaestados;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaA);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    function ObtenerCadena(
        $cadena, $joinnom, $joininvolaut, $fechainicio, $fechafin, $fechainicioD, $fechafinD, $arrayidautor, $arrayidinvol, $cadenaautoresinvol, $cadenaestados, $cadenarepeticion
    )
    {
        $cadena .= $joinnom . $joininvolaut . " WHERE e.idtipoelemento = '3' ";
        if ($fechainicio != null) {
            $cadena .= " AND  a.fechainicio >= '$fechainicio' ";
        }
        if ($fechafin != null) {
            $cadena .= " AND  a.fechafin <= '$fechafin' ";
        }
        if ($fechainicioD != null) {
            $cadena .= " AND  a.fechainicio >= '$fechainicioD' ";
        }
        if ($fechafinD != null) {
            $cadena .= " AND  a.fechafin <= '$fechafinD' ";
        }
        if (isset($arrayidautor[0]) || isset($arrayidinvol[0])) {
            $cadena .= " AND (" . $cadenaautoresinvol . ")";
        }
        $cadena .= $cadenaestados;
        $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";
        return $cadena;
    }

    public function CrearCadenaAutoresInvolucrados(
        $accion, $arrayautoresact, $arrayinvolact
    )
    {
        $cadenaautoresinvol = '';
        if (isset($arrayautoresact[0])) {
            $cadenaautoresinvol = " AND (" . $accion . ".idusuariocrea IN (" . $arrayautoresact
                . ")";
            if (isset($arrayinvolact[0])) {
                $cadenaautoresinvol .= " OR ";
            } else {
                $cadenaautoresinvol .= ")";
            }
        }
        if (isset($arrayinvolact[0])) {
            if (!$arrayautoresact[0]) {
                $cadenaautoresinvol .= " AND (";
            }
            $cadenaautoresinvol
                .= " (" . $accion . "i.llaveinvolucrado IN (" . $arrayinvolact
                . ")) ";
            /* if ($arrayautoresact[0]) {
              $cadenaautoresinvol.= ") ";
              } */
            $cadenaautoresinvol .= ") ";
        }
        return $cadenaautoresinvol;
    }

    public function CrearNoCadenaAutoresInvolucrados(
        $accion, $arrayautoresact, $arrayinvolact
    )
    {
        $cadenaautoresinvol = '';
        if (isset($arrayautoresact[0])) {
            $cadenaautoresinvol = " AND (" . $accion . ".idusuariocrea NOT IN ("
                . $arrayautoresact . ")";
            if (isset($arrayinvolact[0])) {
                $cadenaautoresinvol .= " AND ";
            } else {
                $cadenaautoresinvol .= ")";
            }
        }
        if (isset($arrayinvolact[0])) {
            if (!$arrayautoresact[0]) {
                $cadenaautoresinvol .= " AND (";
            }
            $cadenaautoresinvol
                .= " (" . $accion . "i.llaveinvolucrado NOT IN ("
                . $arrayinvolact
                . ") ";
            $cadenaautoresinvol .= " OR  " . $accion
                . "i.llaveinvolucrado IS NULL ) ";

            $cadenaautoresinvol .= ") ";
        }
        return $cadenaautoresinvol;
    }

    public function CrearCadenaAutorOrigen(
        $accion, $arrayautoresact, $arrayinvolact
    )
    {
        if ($accion == 'r') {
            //cadena sql con autores para sentencia final
            $cadenaautoresinvol = '';
            if (isset($arrayautoresact[0])) {
                $cadenaautoresinvol = " AND ((";
                $totalaut = count($arrayautoresact);
                $operator = " OR ";
                foreach ($arrayautoresact as $key => $autor) {
                    $idusuariocrea = $autor;
                    $autor['idusuariocrea'];
                    if ($key == $totalaut - 1) {
                        $operator = " ";
                    }
                    $cadenaautoresinvol
                        .= " ((r.idusuariocrea = '$idusuariocrea')
                        OR (r.idusuariocrea <> '$idusuariocrea' 
                            AND eeh.idautor = '$idusuariocrea') 
                                OR (r.idusuariocrea <> '$idusuariocrea' 
                                    AND apar.idautor = '$idusuariocrea')) "
                        . $operator;
                }
                $cadenaautoresinvol .= ") ";
                if (isset($arrayinvolact[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            //cadena sql con involucrados para sentencia final
            if (isset($arrayinvolact[0])) {
                if (!$arrayautoresact[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol .= " (";
                $totalinvol = count($arrayinvolact);
                $operator = " OR ";
                foreach ($arrayinvolact as $key => $invol) {
                    $llaveinvolucrado = $invol['llaveinvolucrado'];
                    if ($key == $totalinvol - 1) {
                        $operator = " ";
                    }
                    $cadenaautoresinvol .= " (eir.llaveinvolucrado = '$llaveinvolucrado') "
                        . $operator;
                }
                $cadenaautoresinvol .= ") ";
                if ($arrayautoresact[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        }
        if ($accion == 'o') {
            //cadena sql con autores para sentencia final
            $cadenaautoresinvol = '';
            if (isset($arrayautoresact[0])) {
                $cadenaautoresinvol = " AND ((e.idusuariocrea IN (" . $arrayautoresact
                    . ")) OR (e.idusuariocrea NOT IN (" . $arrayautoresact
                    . ") AND eeh.idautor IN(" . $arrayautoresact
                    . ")) OR (e.idusuariocrea IN (" . $arrayautoresact
                    . ") AND apo.idautor IN(" . $arrayautoresact . "))";
                if (isset($arrayinvolact[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            //cadena sql con involucrados para sentencia final
            if (isset($arrayinvolact[0])) {
                if (!$arrayautoresact[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol
                    .= " ei.llaveinvolucrado IN(" . $arrayinvolact . ")";
                if ($arrayautoresact[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        } else {
            $cadenaautoresinvol = '';
            if (isset($arrayautoresact[0])) {
                $cadenaautoresinvol = " AND ((e.idusuariocrea IN (" . $arrayautoresact
                    . ") OR (e.idusuariocrea NOT IN(" . $arrayautoresact
                    . ") AND eeh.idautor IN(" . $arrayautoresact
                    . ")) OR (e.idusuariocrea NOT IN(" . $arrayautoresact
                    . ") AND apae.idautor IN(" . $arrayautoresact . ")))";
                if (isset($arrayinvolact[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            //cadena sql con involucrados para sentencia final
            if (isset($arrayinvolact[0])) {
                if (!$arrayautoresact[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol
                    .= " ei.llaveinvolucrado IN(" . $arrayinvolact . ")";
                if ($arrayautoresact[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        }
        return $cadenaautoresinvol;
    }

    public function ObtenerCadenaSQLAutorInvolucrado(
        /* $aliastabla, */
        $arrayautores, $arrayinvolucrados
    )
    {
        $cadenaautoresinvol = '';
        if ($accion == 'r') {
            //cadena sql con autores para sentencia final
            if (isset($arrayautores[0])) {
                $cadenaautoresinvol = " AND ((r.idusuariocrea IN (" . $arrayautores . "))";
                if (isset($arrayinvolact[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            //cadena sql con involucrados para sentencia final
            if (isset($arrayinvolucrados[0])) {
                if (!$arrayautores[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol
                    .= "(eir.llaveinvolucrado IN (" . $arrayinvolucrados . "))";
                if ($arrayautores[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        } else {
            $cadenaautoresinvol = '';
            if (isset($arrayautores[0])) {
                $cadenaautoresinvol = " AND ((e.idusuariocrea IN (" . $arrayautores . ")) ";
                if (isset($arrayinvolucrados[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            //cadena sql con involucrados para sentencia final
            if (isset($arrayinvolucrados[0])) {
                if (!$arrayautores[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol
                    .= "(ei.llaveinvolucrado IN (" . $arrayinvolucrados . ")) ";
                if ($arrayautores[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        }
        return $cadenaautoresinvol;
    }

    public function ObtenerCadenaSQLAutorOrigen(
        $aliastabla, $arrayautores, $arrayinvolucrados
    )
    {
        $cadenaautoresinvol = '';
        if ($aliastabla == 'r') {
            //cadena sql con autores para sentencia final
            if (isset($arrayautores[0])) {
                $cadenaautoresinvol = " AND ( (r.idusuariocrea IN (" . $arrayautores
                    . ") OR (r.idusuariocrea NOT IN (" . $arrayautores
                    . ") AND eeh.idautor IN (" . $arrayautores
                    . ")) OR (r.idusuariocrea NOT IN (" . $arrayautores
                    . ") AND apar.idautor IN (" . $arrayautores . ")))";
                if (isset($arrayinvolucrados[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            if (isset($arrayinvolucrados[0])) {
                if (!$arrayautores[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol
                    .= " (eir.llaveinvolucrado IN (" . $arrayinvolucrados
                    . ")) ";
                if ($arrayautores[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        }
        if ($aliastabla == 'o') {
            //cadena sql con autores para sentencia final
            $cadenaautoresinvol = '';
            if (isset($arrayautores[0])) {
                $cadenaautoresinvol = " AND ( (e.idusuariocrea  IN (" . $arrayautores
                    . ") OR (e.idusuariocrea NOT IN (" . $arrayautores
                    . ") AND eeh.idautor IN (" . $arrayautores
                    . ")) OR (e.idusuariocrea NOT IN (" . $arrayautores
                    . ") AND apo.idautor IN (" . $arrayautores . ")))";
                if (isset($arrayinvolact[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            //cadena sql con involucrados para sentencia final
            if (isset($arrayinvolucrados[0])) {
                if (!$arrayautores[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol
                    .= " (ei.llaveinvolucrado IN (" . $arrayinvolucrados
                    . ")) ";
                if ($arrayautoresact[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        } else {
            $cadenaautoresinvol = '';
            if (isset($arrayautores[0])) {
                $cadenaautoresinvol = " AND ( (e.idusuariocrea IN (" . $arrayautores
                    . ") OR (e.idusuariocrea NOT IN (" . $arrayautores
                    . ") AND eeh.idautor IN (" . $arrayautores
                    . ")) OR (e.idusuariocrea NOT IN (" . $arrayautores
                    . ") AND apae.idautor IN (" . $arrayautores . ")))";
                if (isset($arrayinvolucrados[0])) {
                    $cadenaautoresinvol .= " OR ";
                } else {
                    $cadenaautoresinvol .= ")";
                }
            }
            //cadena sql con involucrados para sentencia final
            if (isset($arrayinvolucrados[0])) {
                if (!$arrayautores[0]) {
                    $cadenaautoresinvol .= " AND ";
                }
                $cadenaautoresinvol
                    .= " (ei.llaveinvolucrado IN (" . $arrayinvolucrados
                    . ")) ";
                if ($arrayautores[0]) {
                    $cadenaautoresinvol .= ") ";
                }
            }
        }
        return $cadenaautoresinvol;
    }

    public function CargarActividades_old(
        $hijo, $idactividad, $idusuario, $idelementotributa, $arrayautores, $arrayinvolucrados, $categact, $tipoact, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados, $filtros, $parametros
    )
    {
        if (isset($arrayautores[0]) || isset($arrayinvolucrados[0])) {
            if (isset($arrayautores)) {
                $arrayautores = implode(',', $arrayautores);
            }
            if (isset($arrayinvolucrados)) {
                $arrayinvolucrados = implode(',', $arrayinvolucrados);
            }
            $ifReorganizarIN = "";
            if (isset($parametros->reorganizar[0])) {
                $reorganizar = implode(',', $parametros->reorganizar);
                $ifReorganizar = " AND (e.idelemento NOT IN (" . $reorganizar . ")) ";
                $ifReorganizarIN = " AND (eg.idelemento NOT IN (" . $reorganizar . ")) ";
            }
            if ($parametros->dependenciaTotal || $parametros->dependenciaPorcentual || $parametros->dependenciaPuertaAbierta
            ) {
                $origen = 6;
                $fechas = "";
                $fechasD = "";
                if ($parametros->dependenciaTotal && $parametros->idelementoafiltrar
                ) {
                    $elemento = Doctrine::getTable('DatActividades')->find(
                        $parametros->idelementoafiltrar
                    );
                    $fechainicio = explode('-', $elemento->fechainicio);
                    $fechainicio = $fechainicio[0] . '-' . $fechainicio[1] . '-'
                        . $fechainicio[2];
                    $fechas = " AND a.fechafin <=  '{$elemento->fechainicio}' ";
                    $fechasD = " AND act.fechafin <=  '{$elemento->fechainicio}'";
                }
                if (isset($parametros->arraypadresehijos[0])) {
                    $ifReorganizar = " {$fechas} AND (e.idelemento
                            NOT IN ({$parametros->arraypadresehijos}))
                            AND e.idelemento <> {$parametros->idelementoafiltrar}";
                    $ifReorganizarIN = " {$fechasD} AND (eg.idelemento
                            NOT IN ({$parametros->arraypadresehijos}))
                            AND eg.idelemento <> {$parametros->idelementoafiltrar}";
                } else {
                    if ($parametros->idelementoafiltrar) {
                        $ifReorganizar = " {$fechas}
                                AND e.idelemento <> {$parametros->idelementoafiltrar}";
                        $ifReorganizarIN = " {$fechasD}
                                AND eg.idelemento <> {$parametros->idelementoafiltrar}";
                    }
                }
            }
            $connA = Doctrine_Manager:: connection();
            $cadenaautoresinvol = $this->CrearCadenaAutorOrigen(
                'e', $arrayautores, $arrayinvolucrados
            );
            $cadenarelacion = '';
            //cadena sql con los estados en que puedo ver el documento
            $cadenaestados = '  ';
            if (isset($arrayestados[0])) {
                $cadenaestados = " AND (e.idestadoaprob IN (" . $arrayestados . ")) ";
            }
            //query con sintaxis general a usar en todos los casos
            $cadena = "SELECT DISTINCT(e.idelemento),e.denelemento AS denominacion,
                    e.descelemento,e.llevahistorial, e.idestadoaprob,
                    e.estadocumplimiento,e.gradocumplimiento,e.activo,
                    e.idusuariocrea AS idautor,e.participante AS participantes,
                    a.fechainicio, e.cantobserv AS observaciones,a.horainicio,
                    a.fechafin,e.fechacreacion,e.cantobserv AS observaciones,
                    e.cantrelacdescorigen0,e.cantrelacdescorigen2,
                    a.tiporepeticion,e.actualizarporciento,
                    (SELECT nt.dennomenclador FROM mod_objetivos.nom_nomenclador nt
                    INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                    ON (en2.idnomenclador = nt.idnomenclador
                    AND en2.tiponomenclador = 2
                    AND en2.idelemento = e.idelemento))AS categoria,

                    (SELECT nt.dennomenclador FROM mod_objetivos.nom_nomenclador nt
                    INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                    ON (en2.idnomenclador = nt.idnomenclador
                    AND en2.tiponomenclador = 3
                    AND en2.idelemento = e.idelemento))AS tipoactividad,

                    CASE WHEN e.idelemento IN (SELECT dep.idelementopadre
                    FROM mod_objetivos.dat_elementos_dat_elementos dep
                    WHERE dep.idelementopadre = e.idelemento
                    AND dep.origen >= 6) THEN 1 ELSE 0 END AS tienedependencias,
                    CASE WHEN e.idelemento IN (SELECT alarm.idelemento
                    FROM mod_objetivos.dat_alarma alarm
                    WHERE alarm.idelemento = e.idelemento)
                    THEN 1 ELSE 0 END AS tienealarma
                    FROM mod_objetivos.dat_elementos e
                    INNER JOIN mod_objetivos.dat_actividades a
                    ON a.idactividad = e.idelemento ";
            if ($idactividad != null) {
                $cadena
                    .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                    ee1  ON e.idelemento = ee1.idelementohijo ";
            }
            if (isset($arrayautores[0])) {
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_elementos
                    eeh ON e.idelemento = eeh.idelementohijo ";
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_arc_dat_plan_actividades
                    apae ON a.idactividad = apae.idactividad ";
            }
            $filtrofechas = 0;
            if (isset($arrayelementosrelacionados[0])) {
                $cadenarelacion .= "(";
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON ei.idelemento = e.idelemento ";
                $inneree = 0;
                $innerapa = 0;
                $existetipoelCicta = 0;
                $existereldifCicta = 0;
                foreach (
                    $arrayelementosrelacionados as $key => $elementorelacionado
                ) {
                    if ($elementorelacionado->tipoelemento == 50) {
                        $existetipoelCicta = 1;
                        $idarc = $elementorelacionado->idarc;
                        $idplan = $elementorelacionado->idplan;
                        if ($key != 0) {
                            $cadenarelacion .= " OR ";
                        }
                        $cadenarelacion
                            .= " (apa.idarc = '$idarc'
                            AND apa.idplan = '$idplan') ";
                    } else {
                        $existereldifCicta = 1;
                        $idelementopadre = $elementorelacionado->idplan;
                        if ($elementorelacionado->tipoelemento == 1) {
                            $idelementopadre = $elementorelacionado->idobjetivo;
                        }
                        if ($elementorelacionado->tipoelemento == 2) {
                            $idelementopadre = $elementorelacionado->idfip;
                        }
                        if ($elementorelacionado->tipoelemento == 6) {
                            $idelementopadre = $elementorelacionado->iddesviacion;
                        }
                        if ($key != 0) {
                            $cadenarelacion .= " OR ";
                        }
                        $cadenarelacion .= " (ee.idelementopadre = '$idelementopadre') ";
                    }
                }
                $muletilla = ' INNER ';
                if ($existetipoelCicta && $existereldifCicta) {
                    $muletilla = ' LEFT ';
                }
                if ($existetipoelCicta) {
                    $cadena .= $muletilla
                        . "JOIN mod_objetivos.dat_arc_dat_plan_actividades apa
                            ON apa.idactividad = a.idactividad ";
                }
                if ($existereldifCicta) {
                    $cadena .= $muletilla
                        . "JOIN mod_objetivos.dat_elementos_dat_elementos ee
                            ON e.idelemento = ee.idelementohijo ";
                }
                $cadenarelacion .= ")";
                $cadena .= " WHERE ";
                $wherefiltro = "";
                $cadena .= $cadenarelacion;
                if ($filtros) {
                    $busqueda = 1;
                    foreach ($filtros as $datos) {
                        if ($datos ['field'] == 'idelemento') {
                            $cadena = $cadena . "AND e.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                            $wherefiltro .= " AND eg.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                        } elseif ($datos ['field'] == 'denominacion') {
                            $cadena = $cadena . " AND upper(e.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                            $wherefiltro .= " AND upper(eg.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                        } elseif ($datos ['field'] == 'fechainicio') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechainicio = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechainicio = explode('-', $arrayfechainicio[0]);
                            $cadena = $cadena . " AND a.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                            $wherefiltro .= " AND act.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                        } elseif ($datos ['field'] == 'fechafin') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechafin = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechafin = explode('-', $arrayfechafin[0]);
                            $cadena = $cadena . " AND a.fechafin {$cond} '"
                                . $fechafin[0] . '-' . $fechafin[1] . '-'
                                . $fechafin[2] . "'";
                            $wherefiltro
                                .= " AND act.fechafin {$cond} '" . $fechafin[0]
                                . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                        } elseif ($datos ['field'] == 'textocumplimiento') {
                            $cadena = $cadena
                                . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                        } elseif ($datos ['field'] == 'gradocumplimiento') {
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//menor
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//mayor
                                    $cond = ">";
                                }
                            }
                            $cadena = $cadena . " AND e.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                            $wherefiltro .= " AND eg.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                        } elseif ($datos ['field'] == 'observaciones') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.cantobserv > '0' ";
                            } else {
                                $cadena = $cadena . " AND e.cantobserv = '0' ";
                            }
                        } elseif ($datos ['field'] == 'tienedependencias') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.idelemento IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            } else {
                                $cadena = $cadena . "AND e.idelemento NOT IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            }
                        } elseif ($datos ['field'] == 'categoria') {
                            $cadena = $cadena . " AND (SELECT nt.idnomenclador
                                FROM mod_objetivos.nom_nomenclador nt
                                INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                                ON (en2.idnomenclador = nt.idnomenclador
                                AND en2.tiponomenclador = 2
                                AND en2.idelemento = e.idelemento))  = "
                                . $datos ['data'] ['value'];
                        } elseif ($datos ['field'] == 'tipoactividad') {
                            $cadena = $cadena . " AND (SELECT nt.idnomenclador
                                FROM mod_objetivos.nom_nomenclador nt
                                INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                                ON (en2.idnomenclador = nt.idnomenclador
                                AND en2.tiponomenclador = 3
                                AND en2.idelemento = e.idelemento))  = "
                                . $datos ['data'] ['value'];
                        }
                    }
                }
            } else {
                //creo la cadena a utilizar en todos los casos
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON e.idelemento = ei.idelemento ";
                $cadena .= " WHERE e.idtipoelemento = '3'";
                $wherefiltro = "";
                //print_r($filtros);die;
                if ($filtros) {
                    $busqueda = 1;
                    foreach ($filtros as $datos) {
                        if ($datos ['field'] == 'idelemento') {
                            $cadena = $cadena . "AND e.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                            $wherefiltro .= " AND eg.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                        } elseif ($datos ['field'] == 'denominacion') {
                            $cadena = $cadena . " AND upper(e.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                            $wherefiltro .= " AND upper(eg.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                        } elseif ($datos ['field'] == 'fechainicio') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechainicio = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechainicio = explode('-', $arrayfechainicio[0]);
                            $cadena = $cadena . " AND a.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                            $wherefiltro .= " AND act.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                        } elseif ($datos ['field'] == 'fechafin') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechafin = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechafin = explode('-', $arrayfechafin[0]);
                            $cadena = $cadena . " AND a.fechafin {$cond} '"
                                . $fechafin[0] . '-' . $fechafin[1] . '-'
                                . $fechafin[2] . "'";
                            $wherefiltro
                                .= " AND act.fechafin {$cond} '" . $fechafin[0]
                                . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                        } elseif ($datos ['field'] == 'textocumplimiento') {
                            $cadena = $cadena
                                . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                            $wherefiltro
                                .= "
                                AND eg.estadocumplimiento = '{$datos ['data'] ['value']}'";
                        } elseif ($datos ['field'] == 'gradocumplimiento') {
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//menor
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//mayor
                                    $cond = ">";
                                }
                            }
                            $cadena = $cadena . " AND e.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                            $wherefiltro .= " AND eg.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                        } elseif ($datos ['field'] == 'observaciones') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.cantobserv > '0' ";
                            } else {
                                $cadena = $cadena . " AND e.cantobserv = '0' ";
                            }
                        } elseif ($datos ['field'] == 'tienedependencias') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.idelemento IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            } else {
                                $cadena = $cadena . "AND e.idelemento NOT IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            }
                        } elseif ($datos ['field'] == 'categoria') {
                            $cadena = $cadena . " AND (SELECT nt.idnomenclador
                                FROM mod_objetivos.nom_nomenclador nt
                                INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                                ON (en2.idnomenclador = nt.idnomenclador
                                AND en2.tiponomenclador = 2
                                AND en2.idelemento = e.idelemento))  = "
                                . $datos ['data'] ['value'];
                        } elseif ($datos ['field'] == 'tipoactividad') {
                            $cadena = $cadena . " AND (SELECT nt.idnomenclador
                                FROM mod_objetivos.nom_nomenclador nt
                                INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                                ON (en2.idnomenclador = nt.idnomenclador
                                AND en2.tiponomenclador = 3
                                AND en2.idelemento = e.idelemento))  = "
                                . $datos ['data'] ['value'];
                        }
                    }
                }
            }
            if ($filtrofechas == 0) {
                // del año actual
                $fechainicio = '01-01-' . date('Y');
                $fechafin = '31-12-' . date('Y');
                $cadena = $cadena . " AND (a.fechainicio >= '" . $fechainicio
                    . "' OR a.fechafin >= '" . $fechainicio . "') ";
                //if(!$filtros)
                $wherefiltro .= " AND (act.fechainicio >= '" . $fechainicio
                    . "' OR act.fechafin >= '" . $fechainicio . "') ";
                //a partir del dia de hoy
                /* $fechainicio = date('Y-m-d');
                  $cadena = $cadena." AND (a.fechainicio >= '".$fechainicio."'
                  OR  a.fechafin >= '".$fechainicio."') "; */
            }
            $cadena .= $cadenaautoresinvol . $ifReorganizar;
            if (isset($arrayestados[0])) {
                $cadena .= $cadenaestados;
            }
            if ($parametros->repeticiones == 'false') {
                $cadena .= " AND (a.tiporepeticion IS NULL ) ";
            }
            if ($idactividad != null) {
                $cadena
                    .= " AND ee1.idelementopadre = '$idactividad'
                    AND (ee1.origen = '0' OR ( ee1.origen = '2'
                    AND e.idtipoelemento = '3') )";
            }
            if ($idactividad == null) {
                $nuevacadena = "";
                if ($busqueda == 1) {
                    $nuevacadena = str_ireplace('eg', 'g1', $wherefiltro);
                    $nuevacadena = str_ireplace('act', 'ac', $nuevacadena);
                }
                $nuevacadenarelacion = '';
                if (isset($arrayelementosrelacionados[0]) && $existereldifCicta
                ) {
                    $nuevacadenarelacion = str_ireplace('ee', 'gee', $cadenarelacion) . 'AND ';
                }
                //if ($busqueda != 1) {
                //para que no me muestre las actividades hijas
                //cuyos padres y ellas cumplen con los filtros
                $cadenaautoresinvoldesc = $this->CrearCadenaAutoresInvolucrados(
                    'g', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescA = $this->CrearCadenaAutoresInvolucrados(
                    'g1', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " AND e.idelemento NOT IN(SELECT distinct g.idelemento
                        FROM mod_objetivos.dat_elementos g
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        gi ON gi.idelemento = g.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos gee
                        ON g.idelemento = gee.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos g1
                        ON g1.idelemento = gee.idelementopadre
                        INNER JOIN mod_objetivos.dat_actividades ac
                        ON ac.idactividad = g1.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        g1i ON g1i.idelemento = g1.idelemento
                        WHERE " . $nuevacadenarelacion
                    . " g.idtipoelemento = '3' " . $nuevacadena . "
                        AND g1.idtipoelemento = '3'
                        AND (g.cantrelacascdcorigen0 > 0
                        OR g.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldesc . $cadenaautoresinvoldescA;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (g.idestadoaprob IN (" . $arrayestados
                        . "))";
                }
                $cadena .= ")";
                //}
                if ($parametros->reasignaciones == 'false') {
                    $cadena
                        .= " AND e.idelemento NOT IN (SELECT distinct
                            r.idelemento FROM mod_objetivos.dat_elementos r
                            WHERE r.idtipoelemento = '3'
                            AND r.cantrelacascdcorigen5 > 0 ";
                    if (isset($arrayautores[0])) {
                        $cadena .= " AND r.idusuariocrea IN(" . $arrayautores
                            . ")";
                    }
                    $cadena .= ")";
                }
                //para mostrar los hijos cuyos padres no cumplen con los filtros
                if (isset($arrayelementosrelacionados[0]) && $existereldifCicta
                ) {
                    $nuevacadenarelacion = str_ireplace('ee', 'egee', $cadenarelacion) . 'AND ';
                }
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'eg', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados(
                    'eg1', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " OR e.idelemento IN (SELECT distinct eg.idelemento
                        FROM mod_objetivos.dat_elementos eg
                        LEFT JOIN mod_objetivos.dat_actividades act
                        ON act.idactividad = eg.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        egi ON egi.idelemento = eg.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                        egee ON eg.idelemento = egee.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1
                        ON eg1.idelemento = egee.idelementopadre
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        eg1i ON eg1i.idelemento = eg1.idelemento
                        WHERE " . $nuevacadenarelacion . " eg.idtipoelemento = '3'
                        AND eg1.idtipoelemento = '3' " . $wherefiltro . " "
                    . $ifReorganizarIN . "
                        AND (eg.cantrelacascdcorigen0 > 0
                        OR eg.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (eg.idestadoaprob IN (" . $arrayestados
                        . "))";
                    $cadena
                        .= " AND (eg1.idestadoaprob NOT IN (" . $arrayestados
                        . "))";
                }
                $nuevacadenaForaneos = "";
                if ($busqueda == 1) {
                    $nuevacadenaForaneos = str_ireplace(
                        'eg', 'ega', $wherefiltro
                    );
                    $nuevacadenaForaneos = str_ireplace(
                        'act', 'activ', $nuevacadenaForaneos
                    );
                }
                if (isset($arrayelementosrelacionados[0]) && $existereldifCicta
                ) {
                    $nuevacadenarelacion = str_ireplace('ee', 'egeea', $cadenarelacion) . 'AND ';
                }
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'ega', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearCadenaAutoresInvolucrados(
                    'eg1a', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " AND eg1.idelemento NOT IN (SELECT distinct
                        ega.idelemento FROM mod_objetivos.dat_elementos ega
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        egai ON egai.idelemento = ega.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                        egeea ON ega.idelemento = egeea.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1a
                        ON eg1a.idelemento = egeea.idelementopadre
                        LEFT JOIN mod_objetivos.dat_actividades activ
                        ON activ.idactividad = eg1a.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        eg1ai ON eg1ai.idelemento = eg1a.idelemento
                        WHERE " . $nuevacadenarelacion
                    . " ega.idtipoelemento = '3' " . $nuevacadenaForaneos . "
                        AND eg1a.idtipoelemento = '3'
                        AND (ega.cantrelacascdcorigen0 > 0
                        OR ega.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (ega.idestadoaprob IN (" . $arrayestados
                        . "))";
                }
                $cadena .= ")";

                $cadena .= ")";
            } else {
                //para mostrar los hijos cuyos padres no cumplen con
                //los filtros para un padre especifico
                $nuevacadenarelacion = '';
                if (isset($arrayelementosrelacionados[0]) && $existereldifCicta
                ) {
                    $nuevacadenarelacion = str_ireplace('ee', 'egee', $cadenarelacion) . 'AND ';
                }
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'eg', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados(
                    'eg1', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " OR e.idelemento IN(SELECT distinct eg.idelemento
                        FROM mod_objetivos.dat_elementos eg
                        LEFT JOIN mod_objetivos.dat_actividades act
                        ON act.idactividad = eg.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        egi ON egi.idelemento = eg.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                        egee ON eg.idelemento = egee.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1
                        ON eg1.idelemento = egee.idelementopadre
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        eg1i ON eg1i.idelemento = eg1.idelemento
                        WHERE " . $nuevacadenarelacion
                    . " eg.idtipoelemento = '3' AND egee.idelementopadre="
                    . $idactividad . "
                        AND eg1.idtipoelemento = '3' " . $wherefiltro . " "
                    . $ifReorganizarIN . "
                        AND (eg.cantrelacascdcorigen0 > 0
                        OR eg.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (eg.idestadoaprob IN (" . $arrayestados
                        . "))";
                    $cadena
                        .= " AND (eg1.idestadoaprob NOT IN (" . $arrayestados
                        . "))";
                }
                $nuevacadenaForaneos = "";
                if ($busqueda == 1) {
                    $nuevacadenaForaneos = str_ireplace(
                        'eg', 'ega', $wherefiltro
                    );
                    $nuevacadenaForaneos = str_ireplace(
                        'act', 'activ', $nuevacadenaForaneos
                    );
                }
                if (isset($arrayelementosrelacionados[0]) && $existereldifCicta
                ) {
                    $nuevacadenarelacion = str_ireplace('ee', 'egeea', $cadenarelacion) . 'AND ';
                }
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'ega', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearCadenaAutoresInvolucrados(
                    'eg1a', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " AND eg1.idelemento NOT IN (SELECT distinct
                        ega.idelemento FROM mod_objetivos.dat_elementos ega
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        egai ON egai.idelemento = ega.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                        egeea ON ega.idelemento = egeea.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1a
                        ON eg1a.idelemento = egeea.idelementopadre
                        LEFT JOIN mod_objetivos.dat_actividades activ
                        ON activ.idactividad = eg1a.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        eg1ai ON eg1ai.idelemento = eg1a.idelemento
                        WHERE " . $nuevacadenarelacion
                    . " ega.idtipoelemento = '3' AND egeea.idelementopadre="
                    . $idactividad . " " . $nuevacadenaForaneos . "
                        AND eg1a.idtipoelemento = '3'
                        AND (ega.cantrelacascdcorigen0 > 0
                        OR ega.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (ega.idestadoaprob IN (" . $arrayestados
                        . "))";
                }
                $cadena .= ")";

                $cadena .= ")";
            }
            $resultado['total'] = count(
                $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC)
            );
            if ($parametros->sort) {
                if ($parametros->sort != 'fechafin' && $parametros->sort != 'fechainicio' && $parametros->sort != 'textocumplimiento' && $parametros->sort != 'observaciones' && $parametros->sort != 'nombreautor' && $parametros->sort != 'nombreestadoaprob' && $parametros->sort != 'horainicio' && $parametros->sort != 'horafin'
                ) {
                    $comparar = ($parametros->sort == 'denominacion') ? "denelemento" : $parametros->sort;
                    $cadena .= " ORDER BY e.{$comparar} {$parametros->dir}";
                } else {
                    if ($parametros->sort == 'fechafin' || $parametros->sort == 'fechainicio'
                    ) {
                        $cadena .= "ORDER BY a.{$parametros->sort} {$parametros->dir}";
                    }
                    if ($parametros->sort == 'horainicio' || $parametros->sort == 'horafin'
                    ) {
                        $cadena .= "ORDER BY a.{$parametros->sort} {$parametros->dir}";
                    }
                }
            } else {
                $cadena .= " ORDER BY a.fechainicio DESC, a.horainicio ASC";
            }
            $cadena .= " LIMIT(" . $limit . ") OFFSET(" . $start . ") ";
            //print_r($cadena); die;
            $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
            $resultado['resultado'] = $result;
        } else {
            $resultado['total'] = 0;
            $resultado['resultado'] = array();
        }
        return $resultado;
    }

    //***Cargar act optimizado**********//
    public function CargarActividades($parametros)
    {
        $filtrofechas = 0;
        $cadena = " SELECT DISTINCT (e.idelemento), e.denelemento AS denominacion,
                 e.descelemento as descripcion,
                 a.lugar,
                 CASE WHEN a.numcaso is NULL THEN ''
                ELSE a.numcaso || '' END as numcaso,
                e.descelemento, e.llevahistorial, e.idestadoaprob,
                es.denominacion  AS nombreestadoaprob,
                e.estadocumplimiento AS textocumplimiento, e.gradocumplimiento,
                e.activo, e.idusuariocrea AS idautor,
                e.participante AS participantes,
                a.fechainicio, e.cantobserv AS observaciones, a.horainicio, a.horafin,
                a.fechafin, e.fechacreacion, e.cantobserv AS observaciones,
                a.tiporepeticion, e.actualizarporciento, a.categoria,
                a.tipo AS tipoactividad, a.duracion, a.criterioevaluacion, a.suspendida AS is_suspendida,
                e.controlcambio AS generacontrol, e.cantrelacascdcorigen5 AS tienereasignaciones,
                /*Para que cuando el usuario no tenga persona muestre usuario*/
                ";

        if($parametros->idtipoelemento == 7){
            $cadena .= "  /*Para que cuando el usuario no tenga persona muestre usuario*/
                CASE WHEN pa.idpersona is NULL THEN ua.nombreusuario
                ELSE pa.nombre || ' ' || pa.papel || ' ' || pa.sapel END as nombreautor, ";
        }else{
            $cadena .= " CASE WHEN p.idpersona is NULL THEN u.nombreusuario
                ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor, ";
        }

        $cadena .= " CASE WHEN p.idpersona is NULL THEN 0
                ELSE p.idpersona END as idpersona, ";


        if (isset($parametros->filtros)) {
            //Listar todos los elementos que cumplan con los parametros de busqueda
            $cadena .= 'true AS _is_leaf, ';
        } else {
            $cadena .= 'CASE WHEN (e.cantrelacdescorigen0 > 0 OR e.cantrelacdescorigen2 > 0)
                THEN FALSE ELSE TRUE END AS _is_leaf, ';
        }
        $cadena
            .= " CASE WHEN (e.idusuariocrea != {$parametros->idusuario})
                THEN 1 ELSE 0 END AS superior,
                /*Subordinacion*/
                CASE WHEN s.idpadre != {$parametros->idusuario}
                THEN 1 ELSE 0 END AS subordinado ,
                /*Para saber si la actividad tiene puntualizacion*/ 
                CASE WHEN " . "((SELECT count(*) FROM mod_objetivos.dat_puntualizacion where idactividad = e.idelemento)>0)
                THEN TRUE ELSE FALSE END AS tienepuntualizacion ";
        //***---Si es puntualizar---***//
        if ($parametros->idtipoelemento == 7) {
            $cadena
                .= " , eep.idelementopadre, punt.idpuntualizacion, punt.idautorpunt, 
                         punt.idestadoaprobpunt,  
                         CASE WHEN (punt.ejecutada>0) THEN TRUE ELSE FALSE END AS puntejecutada,
                         CASE WHEN (punt.activa>0) THEN TRUE ELSE FALSE END AS puntactiva,
                         punt.fechacreacionpunt, punt.fechacontrolcambiopunt, punt.idactividadpuntualizacion,
                         est.denominacion as estadoaprobopuntualizacion, punt.suspendida,
                         /*Para que cuando el usuario no tenga persona muestre usuario*/
                         CASE WHEN pp.idpersona is NULL THEN uu.nombreusuario
                         ELSE pp.nombre || ' ' || pp.papel || ' ' || pp.sapel END as nombreautorpunt ";
        }
        //***---Actividades hijas---***//
        if ($parametros->idactividad != null) {
            if ($parametros->busqueda == 1) {
                $cadena
                    .= " , null AS _parent ";
            } else {
                $cadena
                    .= " , {$parametros->idactividad } AS _parent ";
            }
        } else {
            $cadena
                .= " , null AS _parent ";
        }
        $cadena
            .= " FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a
                ON a.idactividad = e.idelemento

                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON e.idelemento = ei.idelemento

                LEFT JOIN mod_flujotrabajo.dat_estado es
                ON e.idestadoaprob = es.idestado

                INNER JOIN mod_seguridad.seg_usuario u
                ON u.idusuario = e.idusuariocrea

                LEFT JOIN mod_persona.dat_persona p
                ON u.idpersona = p.idpersona

                LEFT JOIN mod_objetivos.dat_subordinacion s
                ON s.idhijo = e.idusuariocrea ";

        //***---Si se manda una act padre---***//
        if ($parametros->idactividad != null) {
            $cadena
                .= " LEFT JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON e.idelemento = ee.idelementohijo ";
        }

        //***---Si es puntualizar---***//
        if ($parametros->idtipoelemento == 7) {
            $cadena
                .= " LEFT JOIN mod_objetivos.dat_puntualizacion as punt 
                 ON e.idelemento=punt.idactividadpuntualizacion 
                 LEFT JOIN mod_seguridad.seg_usuario as uu
                 ON uu.idusuario = punt.idautorpunt
                 LEFT JOIN mod_persona.dat_persona as pp
                 ON pp.idpersona = uu.idpersona 
                 LEFT JOIN mod_flujotrabajo.dat_estado as est
                 ON est.idestado=punt.idestadoaprobpunt ";

            $cadena
                .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos eep
                ON (e.idelemento = eep.idelementohijo AND eep.origen = 9 )
                 INNER JOIN mod_objetivos.dat_elementos dep 
                 ON (dep.idelemento = eep.idelementopadre)
                  
                  INNER JOIN mod_seguridad.seg_usuario ua
                ON ua.idusuario = dep.idusuariocrea

                LEFT JOIN mod_persona.dat_persona pa
                ON ua.idpersona = pa.idpersona
                 ";
        }

        //***---Filtro tributa---***//
        if (isset($parametros->arrayelementosrelacionados[0])) {
            $existeArc = 0;
            $existeEle = 0;
            $cadenarelacion = " ( ";
            $signocomparar = ($parametros->opciontributar == 1) ? ' = ' : ' <> ';
            foreach (
                $parametros->arrayelementosrelacionados as $key => $elementorelacionado
            ) {
                if ($elementorelacionado->tipoelemento == 50) {
                    $existeArc = 1;
                    if ($key != 0) {
                        $cadenarelacion .= " OR ";
                    }
                    /* $cadenarelacion
                      .= " (apa.idarc = {$elementorelacionado->idarc}
                      AND apa.idplan = {$elementorelacionado->idplan}) "; */
                    $cadenarelacion
                        .= " (apa.idarc $signocomparar {$elementorelacionado->idarc}
                            AND apa.idplan $signocomparar {$elementorelacionado->idplan}) ";
                } else {
                    $existeEle = 1;
                    $idelementopadre = $elementorelacionado->idplan;
                    if ($elementorelacionado->tipoelemento == 1) {
                        $idelementopadre = $elementorelacionado->idobjetivo;
                    }
                    if ($elementorelacionado->tipoelemento == 2) {
                        $idelementopadre = $elementorelacionado->idfip;
                    }
                    if ($elementorelacionado->tipoelemento == 6) {
                        $idelementopadre = $elementorelacionado->iddesviacion;
                    }
                    if ($key != 0) {
                        $cadenarelacion .= " OR ";
                    }
                    //$cadenarelacion .= " (eet.idelementopadre = '$idelementopadre') ";
                    $cadenarelacion .= " (eet.idelementopadre $signocomparar '$idelementopadre') ";
                }
            }
            $cadenarelacion .= " ) ";
            if ($existeArc) {
                $cadena
                    .= " INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apa
                            ON apa.idactividad = a.idactividad ";
            }
            if ($existeEle) {
                $cadena
                    .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos eet
                            ON e.idelemento = eet.idelementohijo ";
            }
        }
        if ($parametros->idtipoelemento == 7) {
            $cadena .= " WHERE e.idtipoelemento = '7' ";
        } else {
            $cadena .= " WHERE e.idtipoelemento = '3' ";
        }
        //***---Filtro tributa---***//
        if (isset($parametros->arrayelementosrelacionados[0])) {
            $cadena .= " AND " . $cadenarelacion;
        }


        //***---filtro autor/involucrado---***//

      $cadena
        .= " AND ( ";

      $whereEnaprobacion="";
       if($parametros->enaprobacion == 0){
         if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
         ) {
           if (isset($parametros->arrayautores[0])) {
             $whereEnaprobacion
               .= " e.idusuariocrea IN ({$parametros->arrayautores}) ";
             if (isset($parametros->arrayinvolucrados[0])) {
               $whereEnaprobacion
                 .= " OR ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
             }

           } else if (isset($parametros->arrayinvolucrados[0])) {
             if (isset($parametros->arrayinvolucrados[0])) {
               $whereEnaprobacion
                 .= " ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
             }
           }
         }

         if ($parametros->busqueda == 0) {
           if ($parametros->idtipoelemento == 7){
             $whereEnaprobacion.= ($whereEnaprobacion=="")?"":" OR ";
           }else{
             $whereEnaprobacion.= ($whereEnaprobacion=="")?"":" AND ";
           }

           $whereEnaprobacion
             .= " e.idestadoaprob IN (SELECT ue.idestado FROM mod_flujotrabajo.conf_usuario_conf_doc_dat_estado as ue
                    WHERE ue.idusuario = " . $parametros->idusuario . " AND idtipodoc = 3 AND (tipo = 1 OR tipo = 2)) ";
         }

       }
         else {
             if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
             ) {
               /*if ($parametros->busqueda == 0){
                   if (isset($parametros->arrayautores[0])) {
                     $whereEnaprobacion
                       .= " e.idusuariocrea NOT IN ({$parametros->arrayautores}) ";
                     if (isset($parametros->arrayinvolucrados[0])) {
                       $whereEnaprobacion
                         .= " OR ei.llaveinvolucrado NOT IN ({$parametros->arrayinvolucrados})";
                     }

                   } else if (isset($parametros->arrayinvolucrados[0])) {
                     if (isset($parametros->arrayinvolucrados[0])) {
                       $whereEnaprobacion
                         .= " ei.llaveinvolucrado NOT IN ({$parametros->arrayinvolucrados})";
                     }
                   }
                 }
               else {*/
                 if (isset($parametros->arrayautores[0])) {
                   $whereEnaprobacion
                     .= " e.idusuariocrea IN ({$parametros->arrayautores}) ";
                   if (isset($parametros->arrayinvolucrados[0])) {
                     $whereEnaprobacion
                       .= " OR ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
                   }

                 } else if (isset($parametros->arrayinvolucrados[0])) {
                   if (isset($parametros->arrayinvolucrados[0])) {
                     $whereEnaprobacion
                       .= " ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
                   }
                 }
               //}

             }

           if ($parametros->busqueda == 0) {
             if ($parametros->idtipoelemento == 7){
               $whereEnaprobacion.= ($whereEnaprobacion=="")?"":" OR ";
             }else{
               $whereEnaprobacion.= ($whereEnaprobacion=="")?"":" AND ";
             }

             $whereEnaprobacion
               .= " e.idestadoaprob IN (SELECT ue.idestado FROM mod_flujotrabajo.conf_usuario_conf_doc_dat_estado as ue
                    WHERE ue.idusuario = " . $parametros->idusuario . " AND idtipodoc = 3 AND (tipo = 1 OR tipo = 2)) ";
           }
         }

        $cadena.=$whereEnaprobacion;

        //***---Estados de aprobacion---***///
        if (isset($parametros->arrayestados[0])) {
            if ($parametros->idtipoelemento == 7){
                $cadena
                    .= " OR  ";
            }else{
                $cadena
                    .= " AND  ";
            }
            $cadena
                .= " e.idestadoaprob IN ({$parametros->arrayestados}) ";
        }

        $cadena .= " ) ";

        //***---Repeticiones---***//
        if ($parametros->repeticiones == 'false') {
            $cadena
                .= " AND (a.tiporepeticion IS NULL )
                /*No incluya las repeticion*/
                AND e.cantrelacascdcorigen4 = 0";
        }
        //***---Reasignaciones---***//
        if ($parametros->reasignaciones == 'false') {
            $cadena
                .= "/*No incluya las reasignacion*/
                AND e.cantrelacascdcorigen5 = 0 ";
        }
        //***---Actvividades creadas desde Bienestar---***//
        if ($parametros->bienestar == 'true') {
            $cadena
                .= "/*No incluya las reasignacion*/
                AND a.numcaso IS NOT NULL ";
        }
        if ($parametros->idactividad != null) {
            $cadena
                .= " /*listar los hijos del elemento*/
                AND ee.idelementopadre = {$parametros->idactividad } ";
        } else {
            if (!isset($parametros->filtros)) {
                //Garantizar en la busqueda que vengan todos los elementos
                $cadena
                    .= " /*Obtener los padres raices*/
                AND (e.cantrelacascdcorigen0 = 0
                AND e.cantrelacascdcorigen2 = 0)";
            }
        }
        //***---Reorganizar---***//
        if (isset($parametros->reorganizar[0])) {
            $cadena .= " AND (e.idelemento NOT IN ({$parametros->reorganizar})) ";
        }
        //***---Dependencias---***//
        if (($parametros->dependenciaTotal || $parametros->dependenciaPorcentual || $parametros->dependenciaPuertaAbierta) && $parametros->idelementoafiltrar
        ) {
            $cadena .= " AND e.idelemento != {$parametros->idelementoafiltrar} ";
            if (isset($parametros->arraypadresehijos[0])) {
                $cadena .= " AND (e.idelemento NOT IN ({$parametros->arraypadresehijos})) ";
            }
            if ($parametros->dependenciaTotal && $parametros->idelementoafiltrar
            ) {
                $elemento = Doctrine::getTable('DatActividades')->find(
                    $parametros->idelementoafiltrar
                );
                $cadena .= " AND a.fechafin <= '{$elemento->fechainicio}' ";
            } elseif ($parametros->dependenciaPorcentual && $parametros->idelementoafiltrar
            ) {
                $elemento = Doctrine::getTable('DatActividades')->find(
                    $parametros->idelementoafiltrar
                );
                $cadena .= " AND a.fechainicio <= '{$elemento->fechainicio}' ";
            }
        }
        //***---Filtros---***//
        if ($parametros->filtros) {
            $busqueda = 1;
            foreach ($parametros->filtros as $datos) {
                /*                 * *
                 * Filtors para las puntualizaciones
                 * * */
                if ($datos ['field'] == 'nombreautor') {
                  if($parametros->idtipoelemento == 7){
                    $query_nombreautor = str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', mb_strtoupper($datos ['data'] ['value']))))));
                    $cadena .= " AND ((pa.idpersona is not NULL AND 
                  replace(replace(replace(replace(replace(UPPER(pa.nombre || ' ' || pa.papel || ' ' || pa.sapel),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U')
                  LIKE '%" . $query_nombreautor . "%') 
                    OR (pa.idpersona is NULL AND 
                  replace(replace(replace(replace(replace(UPPER(ua.nombreusuario),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U')
                  LIKE '%" . $query_nombreautor . "%'))
                   ";
                  }else{
                    $query_nombreautor = str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', mb_strtoupper($datos ['data'] ['value']))))));
                    $cadena .= " AND ((p.idpersona is not NULL AND 
                  replace(replace(replace(replace(replace(UPPER(p.nombre || ' ' || p.papel || ' ' || p.sapel),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U')
                  LIKE '%" . $query_nombreautor . "%') 
                    OR (p.idpersona is NULL AND 
                  replace(replace(replace(replace(replace(UPPER(u.nombreusuario),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U')
                  LIKE '%" . $query_nombreautor . "%')) ";
                  }

                }
                if ($datos ['field'] == 'nombreautorpunt') {
                    $query_nombreautorpunt = str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', mb_strtoupper($datos ['data'] ['value']))))));
                    $cadena .= " AND ((pp.idpersona is not NULL AND 
                  replace(replace(replace(replace(replace(UPPER(pp.nombre || ' ' || pp.papel || ' ' || pp.sapel),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U')
                  LIKE '%" . $query_nombreautorpunt . "%') 
                    OR (pp.idpersona is NULL AND 
                  replace(replace(replace(replace(replace(UPPER(uu.nombreusuario),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U')
                  LIKE '%" . $query_nombreautorpunt . "%')) ";
                }
                if ($datos ['field'] == 'idelementopadre' && $parametros->idtipoelemento == 7) {
                    $cadena .= " AND punt.idactividad || '' LIKE '%" . $datos ['data'] ['value'] . "%' ";
                }
                if ($datos ['field'] == 'nombreestadoaprob') {
                  $cadena .= "AND e.idestadoaprob = ". $datos ['data'] ['value']. " ";
                }

                if ($datos ['field'] == 'numcaso') {
                    $cadena .= "AND a.numcaso || '' LIKE '%"
                        . $datos ['data'] ['value'] . "%'";
                }

                if ($datos ['field'] == 'puntejecutada') {
                    $cadena .= "AND punt.ejecutada =" . $datos ['data'] ['value'] . " ";
                }
                if ($datos ['field'] == 'puntactiva') {
                    $cadena .= "AND punt.activa =" . $datos ['data'] ['value'] . " ";
                }
                if ($datos ['field'] == 'horainicio') {
                    $cadena .= " AND a.horainicio LIKE '%"
                        . $datos ['data'] ['value'] . "%'";
                }
                if ($datos ['field'] == 'fechacreacionpunt') {
//                  $filtrofechas = 1;
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt'
                        ) {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta
                    //la fecha como un entero
                    $arrayfechacreacionpunt = explode(
                        ' ', $datos ['data'] ['value']
                    );
                    $fechacreacionpunt = explode('-', $arrayfechacreacionpunt[0]);
                    if ($cond == " = ") {
                        $cadena .= " AND SPLIT_PART(punt.fechacreacionpunt || '', ' ', 1) {$cond} '"
                            . $fechacreacionpunt[2] . '/' . $fechacreacionpunt[1] . '/'
                            . $fechacreacionpunt[0] . "'";
                    } else {
                        $cadena .= " AND punt.fechacreacionpunt {$cond} '"
                            . $fechacreacionpunt[0] . '-' . $fechacreacionpunt[1] . '-'
                            . $fechacreacionpunt[2] . "'";
                    }
                }
                /*                 * *******************
                 * Fin de filtros para las puntualizaciones
                 * ********************** */
                if ($datos ['field'] == 'idelemento') {
                    $cadena .= "AND e.uriidelemento LIKE '%"
                        . $datos ['data'] ['value'] . "%'";
                }

                if ($datos ['field'] == 'denominacion') {
                  $query_denominacion = str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', mb_strtoupper($datos ['data'] ['value']))))));
                  $cadena .= " AND replace(replace(replace(replace(replace(UPPER(e.denelemento),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U') LIKE '%"
                        . $query_denominacion . "%'";
                }

                if ($datos ['field'] == 'fechainicio') {
                    $filtrofechas = 1;
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt'
                        ) {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta
                    //la fecha como un entero
                    $arrayfechainicio = explode(
                        ' ', $datos ['data'] ['value']
                    );
                    $fechainicio = explode('-', $arrayfechainicio[0]);
                    $cadena .= " AND a.fechainicio {$cond} '"
                        . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                        . $fechainicio[2] . "'";
                }
                if ($datos ['field'] == 'fechafin') {
                    $filtrofechas = 1;
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt'
                        ) {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta
                    //la fecha como un entero
                    $arrayfechafin = explode(
                        ' ', $datos ['data'] ['value']
                    );
                    $fechafin = explode('-', $arrayfechafin[0]);
                    $cadena .= " AND a.fechafin {$cond} '"
                        . $fechafin[0] . '-' . $fechafin[1] . '-'
                        . $fechafin[2] . "'";
                }
                if ($datos ['field'] == 'textocumplimiento') {
                    $cadena .= " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                }
                if ($datos ['field'] == 'criterioevaluacion') {
                    $cadena .= " AND a.criterioevaluacion = '{$datos ['data'] ['value']}'";
                }
                if ($datos ['field'] == 'gradocumplimiento') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt'
                        ) {//mayor
                            $cond = ">";
                        }
                    }
                    $cadena .= " AND e.gradocumplimiento {$cond} "
                        . ($datos ['data'] ['value'] * 1);
                }
                if ($datos ['field'] == 'observaciones') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $cadena .= " AND e.cantobserv > '0' ";
                    } else {
                        $cadena .= " AND e.cantobserv = '0' ";
                    }
                }
                if ($datos ['field'] == 'categoria') {
                    $cadena
                        .= " AND (SELECT nt.idnomenclador
                                FROM mod_objetivos.nom_nomenclador nt
                                INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                                ON (en2.idnomenclador = nt.idnomenclador
                                AND en2.tiponomenclador = 2
                                AND en2.idelemento = e.idelemento))  in (" . $datos ['data'] ['value'] . ")";
                }
                if ($datos ['field'] == 'tipoactividad') {
                    $cadena
                        .= " AND (SELECT nt.idnomenclador
                                FROM mod_objetivos.nom_nomenclador nt
                                INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2
                                ON (en2.idnomenclador = nt.idnomenclador
                                AND en2.tiponomenclador = 3
                                AND en2.idelemento = e.idelemento))  in (" . $datos ['data'] ['value'] . ")";
                }
            }
        }

        if ($filtrofechas == 0) {
            // del año actual
            $fechainicio = '01-01-' . date('Y');
            $fechafin = '31-12-' . date('Y');
            $cadena
                .= " AND (a.fechainicio >=  '{$fechainicio}'
                     OR a.fechafin >= '{$fechainicio}')";
        }

        if ($parametros->sort) {
            if ($parametros->sort != 'fechafin' && $parametros->sort != 'fechainicio' && $parametros->sort != 'textocumplimiento' && $parametros->sort != 'observaciones' && $parametros->sort != 'nombreautor' && $parametros->sort != 'nombreestadoaprob' && $parametros->sort != 'horainicio' && $parametros->sort != 'horafin'
            ) {
                $comparar = ($parametros->sort == 'denominacion') ? "denelemento" : $parametros->sort;
                $cadena .= " ORDER BY e.{$comparar} {$parametros->dir}";
            } else {
                if ($parametros->sort == 'fechafin' || $parametros->sort == 'fechainicio'
                ) {
                    $cadena .= "ORDER BY a.{$parametros->sort} {$parametros->dir} , a.horainicio ASC";
                }
                if ($parametros->sort == 'horainicio' || $parametros->sort == 'horafin'
                ) {
                    $cadena .= "ORDER BY a.fechainicio ASC,a.{$parametros->sort} {$parametros->dir}";
                }
            }
        } else {
            $cadena .= " ORDER BY a.fechainicio ASC, a.horainicio ASC";
        }

//        print_r($cadena);die;

        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count(
            $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC)
        );

        $cadena .= " LIMIT(" . $parametros->limit . ") OFFSET("
            . $parametros->start . ") ";

        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function getRecordListarActividades($idusuariocrea,$idelemento){
      $connA = Doctrine_Manager:: connection();
      $cadena = " SELECT DISTINCT (e.idelemento), e.denelemento AS denominacion,
                 e.descelemento as descripcion,
                 a.lugar,
                e.descelemento, e.llevahistorial, e.idestadoaprob,
                es.denominacion  AS nombreestadoaprob,
                e.estadocumplimiento AS textocumplimiento, e.gradocumplimiento,
                e.activo, e.idusuariocrea AS idautor,
                e.participante AS participantes,
                a.fechainicio, e.cantobserv AS observaciones, a.horainicio, a.horafin,
                a.fechafin, e.fechacreacion, e.cantobserv AS observaciones,
                a.tiporepeticion, e.actualizarporciento, a.categoria,
                a.tipo AS tipoactividad, a.duracion, a.criterioevaluacion, a.suspendida AS is_suspendida,
                e.controlcambio AS generacontrol, e.cantrelacascdcorigen5 AS tienereasignaciones,
                /*Para que cuando el usuario no tenga persona muestre usuario*/
                CASE WHEN p.idpersona is NULL THEN u.nombreusuario
                ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor,
                CASE WHEN p.idpersona is NULL THEN 0
                ELSE p.idpersona END as idpersona, 
                CASE WHEN (e.cantrelacdescorigen0 > 0 OR e.cantrelacdescorigen2 > 0)
                THEN FALSE ELSE TRUE END AS _is_leaf,  CASE WHEN (e.idusuariocrea != $idusuariocrea)
                THEN 1 ELSE 0 END AS superior,
                /*Subordinacion*/
                CASE WHEN s.idpadre != $idusuariocrea
                THEN 1 ELSE 0 END AS subordinado ,
                /*Para saber si la actividad tiene puntualizacion*/ 
                CASE WHEN ((SELECT count(*) FROM mod_objetivos.dat_puntualizacion where idactividad = e.idelemento)>0)
                THEN TRUE ELSE FALSE END AS tienepuntualizacion  , null AS _parent  FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a
                ON a.idactividad = e.idelemento

                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON e.idelemento = ei.idelemento

                LEFT JOIN mod_flujotrabajo.dat_estado es
                ON e.idestadoaprob = es.idestado

                INNER JOIN mod_seguridad.seg_usuario u
                ON u.idusuario = e.idusuariocrea

                LEFT JOIN mod_persona.dat_persona p
                ON u.idpersona = p.idpersona

                LEFT JOIN mod_objetivos.dat_subordinacion s
                ON s.idhijo = e.idusuariocrea 
                 
                where e.idelemento=$idelemento ";
      $res = $connA->execute($cadena);
      $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
      return $resultado;
    }

    public function cargarPuntualizacion(
        $hijo, $idactividad, $idusuario, $idelementotributa, $arrayautores, $arrayinvolucrados, $categact, $tipoact, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados, $filtros, $parametros
    )
    {
        if (isset($arrayautores[0]) || isset($arrayinvolucrados[0])) {
            if (isset($arrayautores)) {
                $arrayautores = implode(',', $arrayautores);
            }
            if (isset($arrayinvolucrados)) {
                $arrayinvolucrados = implode(',', $arrayinvolucrados);
            }
            $ifReorganizarIN = "";
            if (isset($parametros->reorganizar[0])) {
                $reorganizar = implode(',', $parametros->reorganizar);
                $ifReorganizar = " AND (e.idelemento NOT IN (" . $reorganizar . ")) ";
                $ifReorganizarIN = " AND (eg.idelemento NOT IN (" . $reorganizar . ")) ";
            }

            $connA = Doctrine_Manager:: connection();
            $cadenaautoresinvol = $this->CrearCadenaAutorOrigen(
                'e', $arrayautores, $arrayinvolucrados
            );
            $cadenarelacion = '';
            //cadena sql con los estados en que puedo ver el documento
            $cadenaestados = '  ';
            if (isset($arrayestados[0])) {
                $cadenaestados = " AND (e.idestadoaprob IN (" . $arrayestados . ")) ";
            }
            //query con sintaxis general a usar en todos los casos
            $cadena = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                    e.descelemento,e.llevahistorial, e.idestadoaprob,
                    e.estadocumplimiento,e.gradocumplimiento,e.activo,
                    e.idusuariocrea AS idautor,e.participante AS participantes,
                    a.fechainicio, e.cantobserv AS observaciones,a.horainicio,
                    a.fechafin,e.fechacreacion,e.cantobserv AS observaciones,
                    e.cantrelacdescorigen0,e.cantrelacdescorigen2,
                    dep.idelementopadre,
                    a.tiporepeticion,e.actualizarporciento,a.idactividad
                    FROM mod_objetivos.dat_elementos e
                    INNER JOIN mod_objetivos.dat_actividades a
                    ON a.idactividad = e.idelemento INNER JOIN mod_objetivos.dat_elementos_dat_elementos dep
                    ON dep.idelementohijo = e.idelemento
                    WHERE dep.origen=9 AND dep.idelementopadre IN  ( SELECT distinct(p.idelemento)
                    FROM mod_objetivos.dat_elementos p where p.idusuariocrea="
                . $idusuario . ")";

            $resultado['total'] = count(
                $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC)
            );
            if ($parametros->sort) {
                if ($parametros->sort != 'fechafin' && $parametros->sort != 'fechainicio' && $parametros->sort != 'textocumplimiento' && $parametros->sort != 'observaciones' && $parametros->sort != 'nombreautor' && $parametros->sort != 'nombreestadoaprob' && $parametros->sort != 'horainicio' && $parametros->sort != 'horafin'
                ) {
                    $comparar = ($parametros->sort == 'denominacion') ? "denelemento" : $parametros->sort;
                    $cadena .= " ORDER BY e.{$comparar} {$parametros->dir}";
                } else {
                    if ($parametros->sort == 'fechafin' || $parametros->sort == 'fechainicio'
                    ) {
                        $cadena .= "ORDER BY a.{$parametros->sort} {$parametros->dir}";
                    }
                    if ($parametros->sort == 'horainicio' || $parametros->sort == 'horafin'
                    ) {
                        $cadena .= "ORDER BY a.{$parametros->sort} {$parametros->dir}";
                    }
                }
            } else {
                $cadena .= " ORDER BY a.fechainicio ASC, a.horainicio ASC";
                //  $cadena .= " ORDER BY a.fechainicio DESC ";
            }
            $cadena .= " LIMIT(" . $limit . ") OFFSET(" . $start . ") ";
            $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
            $resultado['resultado'] = $result;
        } else {
            $resultado['total'] = 0;
            $resultado['resultado'] = array();
        }
        return $resultado;
    }

    /**
     * Nombre de la función GetActividades
     * Descripcion  Devuelve un conjunto de actividades dado un arreglo de idacts.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array $arrayidatcs - arreglo de idacts.
     *
     * @return array
     */
    public function GetActividades($arrayidatcs)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                e.descelemento,e.llevahistorial, e.idestadoaprob,
                e.estadocumplimiento,e.gradocumplimiento,e.activo,
                e.idusuariocrea AS idautor,e.participante AS participantes,
                a.fechainicio, e.cantobserv AS observaciones,a.fechafin,
                e.cantobserv AS observaciones   
                FROM mod_objetivos.dat_elementos e 
                INNER JOIN mod_objetivos.dat_actividades a 
                ON a.idactividad = e.idelemento
                WHERE e.idelemento IN(" . implode(",", $arrayidatcs)
            . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultado['total'] = count($result);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    /**
     * Consulta que retorna las repeticiones de una determinada actividad
     */
    public function ObtenerRepeticiones($idactividad, $arrayestados)
    {
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = " ";
        if (isset($arrayestados[0])) {
            $cadenaestados = " AND (";
            $operator = " OR ";
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (e.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        //empiezo a construir query 
        $cadenaA = "SELECT distinct(e.idelemento ),
            a.idactividad AS identificador,e.estadocumplimiento,
            e.gradocumplimiento, e.idusuariocrea,e.idestadoaprob,
            a.fechainicio AS fechaI,a.fechafin AS fechaF,a.horainicio AS hora,
            a.horafin AS horafin,a.lugar,a.tiporepeticion
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_actividades a 
            ON e.idelemento = a.idactividad
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
            ON e.idelemento = ee.idelementohijo
            WHERE ee.origen = '4'  AND ee.idelementopadre = '$idactividad' "
            . $cadenaestados;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaA);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerRepeticionesPaginado(
        $idactividad, $arrayestados, $limit, $start
    )
    {
        if ($start == null) {
            $start = 0;
        }
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = " ";
        if (isset($arrayestados[0])) {
            $cadenaestados = " AND e.idestadoaprob IN(" . $arrayestados . ")";
        }
        //empiezo a construir query 
        $cadenaA = "SELECT distinct(e.idelemento ),
            a.idactividad AS identificador,e.estadocumplimiento,
            e.gradocumplimiento, e.idusuariocrea,e.idestadoaprob,
            a.fechainicio AS fechaI,a.fechafin AS fechaF,a.horainicio AS hora,
            a.horafin AS horafin,a.lugar,a.tiporepeticion
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_actividades a 
            ON e.idelemento = a.idactividad
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
            ON e.idelemento = ee.idelementohijo
            WHERE ee.origen = '4'  AND ee.idelementopadre = '$idactividad' "
            . $cadenaestados .
            " ORDER BY a.fechainicio";
        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count(
            $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC)
        );
        $result = $connA->execute(
            $cadenaA . " LIMIT(" . $limit . ") OFFSET(" . $start . ")"
        )->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function ObtenerActNomenclador($idactpadre)
    {
        $conn = Doctrine_Manager:: connection();
        $query = "SELECT de.idelemento, denn.idnomenclador, denn.tiponomenclador
        FROM mod_objetivos.dat_elementos de
        INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador denn 
        ON de.idelemento = denn.idelemento
        WHERE de.idelemento = '$idactpadre'";
        $res = $conn->execute($query);
        $nomencladores = $res->fetchAll(PDO::FETCH_ASSOC);
        return $nomencladores;
    }

    /**
     * Consulta que retorna objetivos para cargarlos  en el grid de Gestionar Objetivos
     */
    public function CargarObjetivos(
        $idobjetivo, $idusuario, $idelementotributa, $enaprobacion, $arrayautores, $arrayinvolucrados, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados, $filtros, $parametros
    )
    {
        if (isset($arrayautores[0]) || isset($arrayinvolucrados[0])) {
            if (isset($arrayautores)) {
                $arrayautores = implode(',', $arrayautores);
            }
            if (isset($arrayinvolucrados)) {
                $arrayinvolucrados = implode(',', $arrayinvolucrados);
            }
            $connA = Doctrine_Manager:: connection();

            $cadenaautoresinvol = $this->CrearCadenaAutorOrigen(
                'o', $arrayautores, $arrayinvolucrados
            );
            $cadenarelacion = '';
            //cadena sql con los estados en que puedo ver el documento 
            $cadenaestados = '  ';
            if (isset($arrayestados[0])) {
                $cadenaestados = " AND (e.idestadoaprob IN (" . $arrayestados . ")) ";
            }
            $ifReorganizar = "";
            $ifReorganizarIN = "";
            if (isset($parametros->reorganizar[0])) {
                $reorganizar = implode(',', $parametros->reorganizar);
                $ifReorganizar = " AND (e.idelemento NOT IN (" . $reorganizar . ")) ";
                $ifReorganizarIN = " AND (e.idelemento NOT IN (" . $reorganizar . ")) ";
            }
            //query con sintaxis general a usar en todos los casos
            $cadena = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                    e.descelemento,e.llevahistorial, e.idestadoaprob,
                    e.estadocumplimiento,e.gradocumplimiento,e.activo,
                    e.idusuariocrea AS idautor,e.participante AS participantes,
                    o.fechainicio, o.fechafin,e.cantobserv AS observaciones,
                    e.cantrelacdescorigen0,e.cantrelacdescorigen2,

                    CASE WHEN e.idelemento IN (SELECT cm.idobjetivo
                    FROM mod_objetivos.dat_criteriomedida cm)
                    THEN 1 ELSE 0 END AS criteriomedida

                    FROM mod_objetivos.dat_elementos e 
                    INNER JOIN mod_objetivos.dat_objetivo o 
                    ON o.idobjetivo = e.idelemento ";
            if ($idobjetivo != null) {
                $cadena
                    .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                    ee1 ON e.idelemento = ee1.idelementohijo ";
            }
            if (isset($arrayautores[0])) {
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_elementos
                    eeh ON e.idelemento = eeh.idelementohijo ";
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_arc_dat_plan_objetivo
                    apo ON o.idobjetivo = apo.idobjetivo ";
            }
            $filtrofechas = 0;
            if (isset($arrayelementosrelacionados[0])) {
                $cadenarelacion .= "(";
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON ei.idelemento = e.idelemento ";
                $inneree = 0;
                $innerapa = 0;
                $existetipoelCicta = 0;
                $existereldifCicta = 0;
                foreach (
                    $arrayelementosrelacionados as $key => $elementorelacionado
                ) {
                    if ($elementorelacionado->tipoelemento == 50) {
                        $existetipoelCicta = 1;
                        $idarc = $elementorelacionado->idarc;
                        $idplan = $elementorelacionado->idplan;
                        if ($key != 0) {
                            $cadenarelacion .= " OR ";
                        }
                        $cadenarelacion
                            .= " (apo1.idarc = '$idarc'
                            AND apo1.idplan = '$idplan') ";
                    } else {
                        $existereldifCicta = 1;
                        $idelementopadre = $elementorelacionado->idplan;
                        if ($elementorelacionado->tipoelemento == 1) {
                            $idelementopadre = $elementorelacionado->idobjetivo;
                        }
                        if ($elementorelacionado->tipoelemento == 2) {
                            $idelementopadre = $elementorelacionado->idfip;
                        }
                        if ($elementorelacionado->tipoelemento == 6) {
                            $idelementopadre = $elementorelacionado->iddesviacion;
                        }
                        if ($key != 0) {
                            $cadenarelacion .= " OR ";
                        }
                        $cadenarelacion .= " (ee.idelementopadre = '$idelementopadre') ";
                    }
                }
                $muletilla = ' INNER ';
                if ($existetipoelCicta && $existereldifCicta) {
                    $muletilla = ' LEFT ';
                }
                if ($existetipoelCicta) {
                    $cadena .= $muletilla
                        . "JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo1
                            ON apo1.idobjetivo = o.idobjetivo ";
                }
                if ($existereldifCicta) {
                    $cadena .= $muletilla
                        . "JOIN mod_objetivos.dat_elementos_dat_elementos ee
                            ON e.idelemento = ee.idelementohijo ";
                }

                $cadenarelacion .= ")";
                $cadena .= " WHERE ";
                $cadena .= $cadenarelacion;
                $wherefiltro = "";
                //tratamientos de filtros  
                if ($filtros) {
                    $busqueda = 1;
                    foreach ($filtros as $datos) {
                        if ($datos ['field'] == 'idelemento') {
                            $cadena = $cadena . " AND e.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                            $wherefiltro .= " AND eg.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                        } elseif ($datos ['field'] == 'denominacion') {
                            $cadena = $cadena . " AND upper(e.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                            $wherefiltro .= " AND upper(eg.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                        } elseif ($datos ['field'] == 'fechainicio') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            // la fecha como un entero
                            $arrayfechainicio = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechainicio = explode('-', $arrayfechainicio[0]);
                            $cadena = $cadena . " AND o.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                            $wherefiltro .= " AND obj.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                        } elseif ($datos ['field'] == 'fechafin') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            // la fecha como un entero
                            $arrayfechafin = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechafin = explode('-', $arrayfechafin[0]);
                            $cadena = $cadena . " AND o.fechafin {$cond} '"
                                . $fechafin[0] . '-' . $fechafin[1] . '-'
                                . $fechafin[2] . "'";
                            $wherefiltro
                                .= " AND obj.fechafin {$cond} '" . $fechafin[0]
                                . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                        } elseif ($datos ['field'] == 'textocumplimiento') {
                            $cadena = $cadena
                                . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                            $wherefiltro .= " AND eg.estadocumplimiento = '{$datos ['data'] ['value']}'";
                        } elseif ($datos ['field'] == 'gradocumplimiento') {
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//menor
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//mayor
                                    $cond = ">";
                                }
                            }
                            $cadena = $cadena . " AND e.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                            $wherefiltro .= " AND eg.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                        } elseif ($datos ['field'] == 'observaciones') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.cantobserv > '0' ";
                            } else {
                                $cadena = $cadena . " AND e.cantobserv = '0' ";
                            }
                        } elseif ($datos ['field'] == 'criterios') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.idelemento IN (SELECT cm.idobjetivo
                                        FROM mod_objetivos.dat_criteriomedida cm) ";
                            } else {
                                $cadena = $cadena . "AND e.idelemento NOT IN
                                                (SELECT cm.idobjetivo
                                        FROM mod_objetivos.dat_criteriomedida cm) ";
                            }
                        }
                    }
                }
            } else {
                //creo la cadena a utilizar en todos los casos
                //$cadena.= " INNER JOIN mod_objetivos.dat_objetivo o
                //ON o.idobjetivo = e.idelemento";
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON e.idelemento = ei.idelemento ";
                $cadena .= " WHERE e.idtipoelemento = '1' ";
                //tratamientos de filtros  
                if ($filtros) {
                    $busqueda = 1;
                    foreach ($filtros as $datos) {
                        if ($datos ['field'] == 'idelemento') {
                            $cadena = $cadena . "AND e.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                            $wherefiltro .= " AND eg.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                        } elseif ($datos ['field'] == 'denominacion') {
                            $cadena = $cadena . " AND upper(e.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                            $wherefiltro .= " AND upper(eg.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                        } elseif ($datos ['field'] == 'fechainicio') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            // la fecha como un entero
                            $arrayfechainicio = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechainicio = explode('-', $arrayfechainicio[0]);
                            $cadena = $cadena . " AND o.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                            $wherefiltro .= " AND obj.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                        } elseif ($datos ['field'] == 'fechafin') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            // la fecha como un entero
                            $arrayfechafin = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechafin = explode('-', $arrayfechafin[0]);
                            $cadena = $cadena . " AND o.fechafin {$cond} '"
                                . $fechafin[0] . '-' . $fechafin[1] . '-'
                                . $fechafin[2] . "'";
                            $wherefiltro
                                .= " AND obj.fechafin {$cond} '" . $fechafin[0]
                                . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                        } elseif ($datos ['field'] == 'textocumplimiento') {
                            $cadena = $cadena
                                . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                            $wherefiltro
                                .= "
                                AND eg.estadocumplimiento = '{$datos ['data'] ['value']}'";
                        } elseif ($datos ['field'] == 'gradocumplimiento') {
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//menor
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//mayor
                                    $cond = ">";
                                }
                            }
                            $cadena = $cadena . " AND e.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                            $wherefiltro .= " AND eg.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                        } elseif ($datos ['field'] == 'observaciones') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.cantobserv > '0' ";
                            } else {
                                $cadena = $cadena . " AND e.cantobserv = '0' ";
                            }
                        } elseif ($datos ['field'] == 'criterios') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.idelemento IN (SELECT cm.idobjetivo
                                        FROM mod_objetivos.dat_criteriomedida cm) ";
                            } else {
                                $cadena = $cadena . "AND e.idelemento NOT IN
                                                (SELECT cm.idobjetivo
                                        FROM mod_objetivos.dat_criteriomedida cm) ";
                            }
                        }
                    }
                }
            }
            if ($filtrofechas == 0) {
                // del año actual
                $fechainicio = '01-01-' . date('Y');
                $fechafin = '31-12-' . date('Y');
                $cadena = $cadena . " AND (o.fechainicio >= '" . $fechainicio
                    . "' OR o.fechafin >= '" . $fechainicio . "') ";
                $wherefiltro .= " AND (obj.fechainicio >= '" . $fechainicio
                    . "' OR obj.fechafin >= '" . $fechainicio . "') ";
                //a partir del dia de hoy
                /* $fechainicio = date('Y-m-d');
                  $cadena = $cadena." AND (a.fechainicio >= '".$fechainicio."'
                  OR  a.fechafin >= '".$fechainicio."') "; */
            }

            $cadena .= $cadenaautoresinvol . $ifReorganizar . $cadenaestados;

            if ($idobjetivo != null) {
                $cadena
                    .= " AND ee1.idelementopadre = '$idobjetivo'
                AND (ee1.origen = '0' OR ee1.origen = '2') ";
            }
            if ($idobjetivo == null) {
                $nuevacadena = "";
                if ($busqueda == 1) {
                    $nuevacadena = str_ireplace('eg', 'g1', $wherefiltro);
                    $nuevacadena = str_ireplace('obj', 'ob', $nuevacadena);
                }
                $cadenaautoresinvoldesc = $this->CrearCadenaAutoresInvolucrados(
                    'g', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescU = $this->CrearCadenaAutoresInvolucrados(
                    'g1', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " AND e.idelemento NOT IN (SELECT distinct g.idelemento
                        FROM mod_objetivos.dat_elementos g                     
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        gi ON gi.idelemento = g.idelemento					 
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
                        gee ON g.idelemento = gee.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos g1 
                        ON g1.idelemento = gee.idelementopadre
                        INNER JOIN mod_objetivos.dat_objetivo ob 
                        ON ob.idobjetivo = g1.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        g1i ON g1i.idelemento = g1.idelemento					 
                        WHERE g.idtipoelemento = '1' 
                        AND g1.idtipoelemento = '1' 
                        AND (g.cantrelacascdcorigen0 > 0 
                        OR g.cantrelacascdcorigen2 > 0) " . $nuevacadena . " "
                    . $cadenaautoresinvoldesc . $cadenaautoresinvoldescU . ")";
                //para listar los hijos cuyos padres no cumplan 
                //con las condiciones o filtros
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'eg', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados(
                    'eg1', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " OR e.idelemento IN(SELECT distinct eg.idelemento
                        FROM mod_objetivos.dat_elementos eg
                        LEFT JOIN mod_objetivos.dat_objetivo obj 
                        ON obj.idobjetivo = eg.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        egi ON egi.idelemento = eg.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
                        egee ON eg.idelemento = egee.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1 
                        ON eg1.idelemento = egee.idelementopadre
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        eg1i ON eg1i.idelemento = eg1.idelemento				 
                        WHERE eg.idtipoelemento = '3' 
                        AND eg1.idtipoelemento = '3' " . $wherefiltro . " "
                    . $ifReorganizarIN . "
                        AND (eg.cantrelacascdcorigen0 > 0 
                        OR eg.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (eg.idestadoaprob IN (" . $arrayestados
                        . "))";
                    $cadena
                        .= " AND (eg1.idestadoaprob NOT IN (" . $arrayestados
                        . "))";
                }
                $nuevacadenaForaneos = "";
                if ($busqueda == 1) {
                    $nuevacadenaForaneos = str_ireplace(
                        'eg', 'ega', $wherefiltro
                    );
                    $nuevacadenaForaneos = str_ireplace(
                        'obj', 'obje', $nuevacadenaForaneos
                    );
                }
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'ega', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados(
                    'eg1a', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " AND eg1.idelemento NOT IN (SELECT distinct
                        ega.idelemento FROM mod_objetivos.dat_elementos ega                       
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        egai ON egai.idelemento = ega.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
                        egeea ON ega.idelemento = egeea.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1a 
                        ON eg1a.idelemento = egeea.idelementopadre
                        LEFT JOIN mod_objetivos.dat_objetivo obje 
                        ON obje.idobjetivo = eg1a.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        eg1ai ON eg1ai.idelemento = eg1a.idelemento				 
                        WHERE ega.idtipoelemento = '3' " . $nuevacadenaForaneos
                    . "
                        AND eg1a.idtipoelemento = '3' 
                        AND (ega.cantrelacascdcorigen0 > 0 
                        OR ega.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (ega.idestadoaprob IN (" . $arrayestados
                        . "))";
                }
                $cadena .= ")";
                $cadena .= ")";
            } else {
                //para mostrar los hijos cuyos padres no cumplen con los
                //filtros para un padre especifico
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'eg', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados(
                    'eg1', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " OR e.idelemento IN (SELECT distinct eg.idelemento
                        FROM mod_objetivos.dat_elementos eg
                        LEFT JOIN mod_objetivos.dat_objetivo obj 
                        ON obj.idobjetivo = eg.idelemento
                        LEFT JOIN mod_objetivos.dat_actividades act 
                        ON act.idactividad = eg.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        egi ON egi.idelemento = eg.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
                        egee ON eg.idelemento = egee.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1 
                        ON eg1.idelemento = egee.idelementopadre
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        eg1i ON eg1i.idelemento = eg1.idelemento				 
                        WHERE eg.idtipoelemento = '3' AND egee.idelementopadre="
                    . $idobjetivo . "
                        AND eg1.idtipoelemento = '3' " . $wherefiltro . " "
                    . $ifReorganizarIN . "
                        AND (eg.cantrelacascdcorigen0 > 0 
                        OR eg.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (eg.idestadoaprob IN (" . $arrayestados
                        . "))";
                    $cadena
                        .= " AND (eg1.idestadoaprob NOT IN (" . $arrayestados
                        . "))";
                }
                $nuevacadenaForaneos = "";
                if ($busqueda == 1) {
                    $nuevacadenaForaneos = str_ireplace(
                        'eg', 'ega', $wherefiltro
                    );
                    $nuevacadenaForaneos = str_ireplace(
                        'obj', 'obje', $nuevacadenaForaneos
                    );
                }
                $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados(
                    'ega', $arrayautores, $arrayinvolucrados
                );
                $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados(
                    'eg1a', $arrayautores, $arrayinvolucrados
                );
                $cadena
                    .= " AND eg1.idelemento NOT IN (SELECT distinct
                        ega.idelemento FROM mod_objetivos.dat_elementos ega                         
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        egai ON egai.idelemento = ega.idelemento
                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos 
                        egeea ON ega.idelemento = egeea.idelementohijo
                        INNER JOIN  mod_objetivos.dat_elementos eg1a ON 
                        eg1a.idelemento = egeea.idelementopadre
                        LEFT JOIN mod_objetivos.dat_objetivo obje 
                        ON obje.idobjetivo = eg1a.idelemento
                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        eg1ai ON eg1ai.idelemento = eg1a.idelemento				 
                        WHERE ega.idtipoelemento = '3' 
                        AND egeea.idelementopadre="
                    . $idobjetivo . " " . $nuevacadenaForaneos . "
                        AND eg1a.idtipoelemento = '3' 
                        AND (ega.cantrelacascdcorigen0 > 0 
                        OR ega.cantrelacascdcorigen2 > 0) "
                    .
                    $cadenaautoresinvoldescDparte
                    . $cadenaautoresinvoldescDoceparte;
                if (isset($arrayestados[0])) {
                    $cadena .= " AND (ega.idestadoaprob IN (" . $arrayestados
                        . "))";
                }
                $cadena .= ")";
                $cadena .= ")";
            }
            $cadena
                .= " AND e.idelemento NOT IN(SELECT distinct r.idelemento
                    FROM mod_objetivos.dat_elementos r
                    WHERE r.idtipoelemento = '1' 
                    AND r.cantrelacascdcorigen5 > 0 ";
            if (isset($arrayautores[0])) {
                $cadena .= "AND r.idusuariocrea IN(" . $arrayautores . ")";
            }
            $cadena .= ")";
            $resnopag = $connA->execute($cadena);
            $resultnopag = $resnopag->fetchAll(PDO::FETCH_ASSOC);
            $total = count($resultnopag);
            if ($start == null) {
                $start = 0;
            }
            if ($parametros->sort) {
                if ($parametros->sort != 'fechafin' && $parametros->sort != 'fechainicio' && $parametros->sort != 'textocumplimiento' && $parametros->sort != 'observaciones' && $parametros->sort != 'nombreautor' && $parametros->sort != 'nombreestadoaprob'
                ) {
                    $comparar = ($parametros->sort == 'denominacion') ? "denelemento" : $parametros->sort;
                    $cadena .= " ORDER BY e.{$comparar} {$parametros->dir}";
                } else {
                    if ($parametros->sort == 'fechafin' || $parametros->sort == 'fechainicio'
                    ) {
                        $cadena .= " ORDER BY o.{$parametros->sort} {$parametros->dir}";
                    } else {
                        $cadena .= " ORDER BY e.idelemento {$parametros->dir}";
                    }
                }
            } else {
                //$cadena .= " ORDER BY e.idelemento ASC";
                $cadena .= " ORDER BY o.fechainicio ASC";
            }
            $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit . ")";
            $res = $connA->execute($cadena);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $total = 0;
            $result = array();
        }
        $resultado['total'] = $total;
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function CargarIdObjetivos(
        $idobjetivo, $idusuario, $idelementotributa, $denominacion, $fechainicio, $fechafin, $arrayautores, $arrayinvolucrados, $car,
        /* $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, */
        $arrayestados, /* $busqueda, */
        $arrayelementosrelacionados
    )
    {
        if (isset($arrayautores)) {
            $arrayautores = implode(',', $arrayautores);
        }
        if (isset($arrayinvolucrados)) {
            $arrayinvolucrados = implode(',', $arrayinvolucrados);
        }
        if (isset($arrayestados)) {
            $arrayestados = implode(',', $arrayestados);
        }
        $connA = Doctrine_Manager:: connection();
        $cadenaautoresinvol = $this->CrearCadenaAutorOrigen(
            'o', $arrayautores, $arrayinvolucrados
        );
        $cadenarelacion = '';
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = '  ';
        if (isset($arrayestados[0])) {
            $cadenaestados = " AND (e.idestadoaprob IN (" . $arrayestados . ")) ";
        }
        //query con sintaxis general a usar en todos los casos
        $cadena = "SELECT distinct(e.idelemento), e.idelemento AS idobjetivo,
                e.denelemento
                FROM mod_objetivos.dat_elementos e 
                INNER JOIN mod_objetivos.dat_objetivo o 
                ON o.idobjetivo = e.idelemento ";
        if (isset($arrayautores[0])) {
            $cadena
                .= " LEFT JOIN mod_objetivos.dat_elementos_dat_elementos
                eeh ON e.idelemento = eeh.idelementohijo ";
            $cadena
                .= " LEFT JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo
                ON o.idobjetivo = apo.idobjetivo ";
        }
        if (isset($arrayelementosrelacionados[0])) {
            $cadenarelacion .= "(";
            $cadena
                .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                ei ON ei.idelemento = e.idelemento ";
            //$inneree = 0;
            //$innerapa = 0;
            $existetipoelCicta = 0;
            $existereldifCicta = 0;
            foreach (
                $arrayelementosrelacionados as $key => $elementorelacionado
            ) {
                if ($elementorelacionado->tipoelemento == 50) {
                    $existetipoelCicta = 1;
                    $idarc = $elementorelacionado->idarc;
                    $idplan = $elementorelacionado->idplan;
                    if ($key != 0) {
                        $cadenarelacion .= " OR ";
                    }
                    $cadenarelacion
                        .= " (apo1.idarc = '$idarc'
                        AND apo1.idplan = '$idplan') ";
                } else {
                    $existereldifCicta = 1;
                    $idelementopadre = $elementorelacionado->idplan;
                    if ($elementorelacionado->tipoelemento == 1) {
                        $idelementopadre = $elementorelacionado->idobjetivo;
                    }
                    if ($elementorelacionado->tipoelemento == 2) {
                        $idelementopadre = $elementorelacionado->idfip;
                    }
                    if ($key != 0) {
                        $cadenarelacion .= " OR ";
                    }
                    $cadenarelacion .= " (ee.idelementopadre = '$idelementopadre') ";
                }
            }
            $muletilla = ' INNER ';
            if ($existetipoelCicta && $existereldifCicta) {
                $muletilla = ' LEFT ';
            }
            if ($existetipoelCicta) {
                $cadena .= $muletilla
                    . "JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo1
                        ON apo1.idobjetivo = o.idobjetivo ";
            }
            if ($existereldifCicta) {
                $cadena .= $muletilla
                    . "JOIN mod_objetivos.dat_elementos_dat_elementos ee
                        ON e.idelemento = ee.idelementohijo ";
            }
            $cadenarelacion .= ")";
            $cadena .= " WHERE ";
            $cadena .= $cadenarelacion;
            if ($denominacionb != null) {
                $cadena .= " AND  e.denelemento LIKE '%$denominacionb%' ";
            }
            if ($fechainicio != null) {
                $cadena .= " AND  o.fechainicio >= '$fechainicio' ";
            }
            if ($fechafin != null) {
                $cadena .= " AND  o.fechafin <= '$fechafin' ";
            }
            if ($car != null) {
                $cadena .= " AND  e.idelemento = '$car' ";
            }
        } else {
            //creo la cadena a utilizar en todos los casos
            //$cadena.= " INNER JOIN mod_objetivos.dat_objetivo o
            //ON o.idobjetivo = e.idelemento";
            $cadena
                .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                ei ON e.idelemento = ei.idelemento ";
            $cadena .= " WHERE e.idtipoelemento = '1'";
            if ($denominacion != null) {
                $cadena .= " AND e.denelemento LIKE '%$denominacion%'  ";
            }
            if ($fechainicio != null) {
                $cadena .= " AND o.fechainicio >= '$fechainicio'  ";
            }
            if ($fechafin != null) {
                $cadena .= " AND o.fechafin <= '$fechafin'  ";
            }
            if ($car != null) {
                $cadena .= " AND  e.idelemento = '$car' ";
            }
        }
        $cadena .= $cadenaautoresinvol . $cadenaestados;
        $cadena
            .= " AND e.idelemento NOT IN (SELECT distinct r.idelemento
                FROM mod_objetivos.dat_elementos r
                WHERE r.idtipoelemento = '1' AND r.cantrelacascdcorigen5 > 0 
                AND r.idusuariocrea IN(" . $arrayautores . "))";
        $resnopag = $connA->execute($cadena);
        $resultado = $resnopag->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    /**
     * Nombre de la función GetObjetivos
     * Descripcion  Devuelve un conjunto de objetivos dado un arreglo de idobjetivos.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array $arrayidobj - arreglo de idobjetivos.
     *
     * @return array
     */
    public function GetObjetivos($arrayidobj)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                e.descelemento,e.llevahistorial, e.idestadoaprob,
                e.estadocumplimiento,e.gradocumplimiento,e.activo,
                e.idusuariocrea AS idautor,e.participante AS participantes,
                o.fechainicio, e.cantobserv AS observaciones,o.fechafin,
                e.cantobserv AS observaciones   
                FROM mod_objetivos.dat_elementos e 
                INNER JOIN mod_objetivos.dat_objetivo o 
                ON o.idobjetivo = e.idelemento
                WHERE e.idelemento IN(" . implode(
                ",", $arrayidobj
            ) . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultado['total'] = count($result);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function CargarFips($idfip, $idusuario, $idelementotributa, $arrayautoresact, $arrayinvolact, $nivelacceso, $tipoact, $start, $limit, $busqueda, $filtros, $reorganizar)
    {
        if (isset($arrayautoresact)) {
            $arrayautoresact = implode(',', $arrayautoresact);
        }
        if (isset($arrayinvolact)) {
            $arrayinvolact = implode(',', $arrayinvolact);
        }
        $connA = Doctrine_Manager:: connection();
        $cadenaautoresinvol = $this->CrearCadenaAutoresInvolucrados('e', $arrayautoresact, $arrayinvolact);
        $cadenadescendencia = "SELECT distinct g.idelemento
            FROM mod_objetivos.dat_elementos g
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeg 
            ON g.idelemento = eeg.idelementohijo
            LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eig 
            ON g.idelemento = eig.idelemento
            WHERE eeg.origen = '0'" . $cadenaautoresinvoldesc;
        //tratamientos de filtros
        $addwhere = "";
        $wherefiltro = "";
        if ($filtros) {
            $busqueda = 1;
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'idelemento') {
                    $addwhere = $addwhere . "AND e.uriidelemento LIKE '%" . $datos ['data'] ['value'] . "%'";
                    $wherefiltro .= " AND eg.uriidelemento LIKE '%" . $datos ['data'] ['value'] . "%'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $addwhere = $addwhere . " AND upper(e.denelemento) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%'";
                    $wherefiltro .= " AND upper(eg.denelemento) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'tipofip') {
                    $addwhere = $addwhere . " AND nn.idnomenclador = " . $datos ['data'] ['value'];
                    $wherefiltro .= " AND nn.idnomenclador = " . $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'fechainicio') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta 
                    //la fecha como un entero
                    $arrayfechainicio = explode(' ', $datos ['data'] ['value']);
                    $fechainicio = explode('-', $arrayfechainicio[0]);
                    $addwhere = $addwhere . " AND f.fechaemision {$cond} '"
                        . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                        . $fechainicio[2] . "'";
                    $wherefiltro
                        .= " AND fi.fechaemision {$cond} '" . $fechainicio[0]
                        . '-'
                        . $fechainicio[1] . '-' . $fechainicio[2] . "'";
                } elseif ($datos ['field'] == 'fechafin') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta
                    // la fecha como un entero
                    $arrayfechafin = explode(' ', $datos ['data'] ['value']);
                    $fechafin = explode('-', $arrayfechafin[0]);
                    $addwhere = $addwhere . " AND f.fechacumplimiento {$cond} '"
                        . $fechafin[0] . '-' . $fechafin[1] . '-' . $fechafin[2]
                        . "'";
                    $wherefiltro
                        .= " AND fi.fechacumplimiento {$cond} '" . $fechafin[0]
                        . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                } elseif ($datos ['field'] == 'fechascontrol') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta
                    // la fecha como un entero
                    $arrayfechacontrol = explode(
                        ' ', $datos ['data'] ['value']
                    );
                    $fechacontrol = explode('-', $arrayfechacontrol[0]);
                    $addwhere = $addwhere . " AND fc.fechacontrol {$cond} '"
                        . $fechacontrol[0] . '-' . $fechacontrol[1] . '-'
                        . $fechacontrol[2] . "'";
                    $wherefiltro
                        .= " AND fcon.fechacontrol {$cond} '" . $fechacontrol[0]
                        . '-' . $fechacontrol[1] . '-' . $fechacontrol[2] . "'";
                } elseif ($datos ['field'] == 'textocumplimiento') {
                    $addwhere = $addwhere
                        . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                    $wherefiltro
                        .= "
                        AND eg.estadocumplimiento = '{$datos ['data'] ['value']}'";
                } elseif ($datos ['field'] == 'gradocumplimiento') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//mayor
                            $cond = ">";
                        }
                    }
                    $addwhere = $addwhere . " AND e.gradocumplimiento {$cond} "
                        . ($datos ['data'] ['value'] * 1);
                    $wherefiltro .= " AND eg.gradocumplimiento {$cond} "
                        . ($datos ['data'] ['value'] * 1);
                } elseif ($datos ['field'] == 'observaciones') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $addwhere = $addwhere . " AND e.cantobserv > '0' ";
                    } else {
                        $addwhere = $addwhere . " AND e.cantobserv = '0' ";
                    }
                }
            }
        } else {
            $busqueda = 1;
            $dia = '01'; //date(j);
            $mes = '01'; //date(n);
            $anho = date(Y);
            $cond = " > ";
            $addwhere = $addwhere . " AND (";
            $addwhere = $addwhere . "f.fechacumplimiento {$cond} '" . $dia . '-'
                . $mes
                . '-' . $anho . "'";
            $addwhere = $addwhere . " OR fc.fechacontrol {$cond} '" . $dia . '-'
                . $mes
                . '-' . $anho . "'";
            $addwhere = $addwhere . " OR f.fechaemision {$cond} '" . $dia . '-' . $mes
                . '-' . $anho . "'";
            $addwhere = $addwhere . " )";
        }

        //query con sintaxis general a usar en todos los casos
        $cadena = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                e.descelemento,
                e.llevahistorial, e.estadocumplimiento,
                e.gradocumplimiento,e.activo, e.idusuariocrea AS idautor,
                u.nombreusuario as autor,
                e.participante AS participantes, e.cantobserv AS observaciones,
                e.cantobserv AS observaciones ,f.fechaemision AS fechainicio,  
                f.fechacumplimiento AS fechafin,
                e.cantrelacdescorigen0,
                e.cantrelacdescorigen1,
                nn.idnomenclador as idtipofip,
                nn.dennomenclador as tipofip,
                e.cantrelacdescorigen2
                FROM mod_objetivos.dat_elementos e 
                LEFT JOIN mod_objetivos.dat_fechacontrol fc 
                ON fc.idelemento = e.idelemento 
                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador nf on (nf.idelemento = e.idelemento and nf.tiponomenclador = 4)
                LEFT JOIN mod_objetivos.nom_nomenclador nn on (nn.idnomenclador = nf.idnomenclador and nn.tiponomenclador = 4)
                LEFT JOIN mod_seguridad.seg_usuario u on (e.idusuariocrea = u.idusuario) ";
        if ($nivelacceso != null || $tipoact != null) {
            if ($nivelacceso != null) {
                $cadena .= " INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en ON e.idelemento = en.idelemento";
                $cadena .= " AND en.idnomenclador = '$nivelacceso'";
            }
            if ($tipoact != null) {
                $cadena .= " INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en2 ON e.idelemento = en2.idelemento";
                $cadena .= " AND en2.idnomenclador = '$tipoact'";
            }
        }
        if ($idfip != null) {
            $cadena .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                ee1 ON e.idelemento = ee1.idelementohijo ";
        }
        //creo la cadena a utilizar en todos los casos
        $cadena .= " INNER JOIN mod_objetivos.dat_fip f ON f.idfip = e.idelemento";
        $cadena .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei ON e.idelemento = ei.idelemento ";
        $cadena .= " WHERE e.idtipoelemento = '2'";
        $cadena .= $cadenaautoresinvol;

        /******************
          Fips a reorganizar
         *******************/
        if (isset($reorganizar[0])) {
          $cadena .= " AND (e.idelemento NOT IN ({$reorganizar})) ";
        }

        if ($idfip != null) {
            $cadena .= " AND ee1.idelementopadre = '$idfip' AND (ee1.origen = '0'
                OR ( ee1.origen = '2' AND e.idtipoelemento = '2') )";
        }
        $cadena .= " {$addwhere} ";
        if ($idfip == null) {
            $nuevacadena = "";
            if ($busqueda == 1) {
                $nuevacadena = str_ireplace('eg', 'g1', $wherefiltro);
                $nuevacadena = str_ireplace('fi', 'fip', $nuevacadena);
                $nuevacadena = str_ireplace('fcon', 'fec', $nuevacadena);
            }
            $cadenaautoresinvoldesc = $this->CrearCadenaAutoresInvolucrados('g', $arrayautoresact, $arrayinvolact);
            $cadenaautoresinvoldescU = $this->CrearCadenaAutoresInvolucrados('g1', $arrayautoresact, $arrayinvolact);
            $cadena .= " AND e.idelemento NOT IN (SELECT distinct g.idelemento
                    FROM mod_objetivos.dat_elementos g
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados gi 
                    ON gi.idelemento = g.idelemento
                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos gee 
                    ON g.idelemento = gee.idelementohijo
                    INNER JOIN  mod_objetivos.dat_elementos g1 
                    ON g1.idelemento = gee.idelementopadre
                    INNER JOIN mod_objetivos.dat_fip fip 
                    ON fip.idfip = g1.idelemento
                    LEFT JOIN mod_objetivos.dat_fechacontrol fec 
                    ON fec.idelemento = g1.idelemento
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados g1i 
                    ON g1i.idelemento = g1.idelemento				 
                    WHERE g.idtipoelemento = '2' AND g1.idtipoelemento = '2' "
                . $nuevacadena . " AND (g.cantrelacascdcorigen0 > 0
                    OR g.cantrelacascdcorigen2 > 0) " . $cadenaautoresinvoldesc
                . $cadenaautoresinvoldescU . ")";
            //para listar los hijos cuyos padres no cumplan con
            //las condiciones o filtros
            //esto es para definir las condiciones que no
            //van a cumplir los padres
            /* $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados('eg', $arrayautoresact, $arrayinvolact);
              $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados('eg1', $arrayautoresact, $arrayinvolact);
              $cadena
              .= " OR e.idelemento IN	( SELECT distinct eg.idelemento
              FROM mod_objetivos.dat_elementos eg
              INNER JOIN mod_objetivos.dat_fip fi
              ON fi.idfip = eg.idelemento
              LEFT JOIN mod_objetivos.dat_fechacontrol fcon
              ON fcon.idelemento = eg.idelemento
              LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados egi
              ON egi.idelemento = eg.idelemento
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos egee
              ON eg.idelemento = egee.idelementohijo
              INNER JOIN  mod_objetivos.dat_elementos eg1
              ON eg1.idelemento = egee.idelementopadre
              INNER JOIN mod_objetivos.dat_fip fi1
              ON fi1.idfip = eg1.idelemento
              LEFT JOIN mod_objetivos.dat_fechacontrol fcon1
              ON fcon1.idelemento = eg1.idelemento
              LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eg1i
              ON eg1i.idelemento = eg1.idelemento
              WHERE eg.idtipoelemento = '2'
              AND eg1.idtipoelemento = '2' " . $wherefiltro . "
              AND (eg.cantrelacascdcorigen0 > 0
              OR eg.cantrelacascdcorigen2 > 0) "
              .
              $cadenaautoresinvoldescDparte
              . $cadenaautoresinvoldescDoceparte; */
            $nuevacadenaForaneos = "";
            if ($busqueda == 1) {
                $nuevacadenaForaneos = str_ireplace('eg', 'ega', $wherefiltro);
                $nuevacadenaForaneos = str_ireplace('fi', 'fin', $nuevacadenaForaneos);
                $nuevacadenaForaneos = str_ireplace('fcon', 'feco', $nuevacadenaForaneos);
            }
            /* $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados('ega', $arrayautoresact, $arrayinvolact);
              $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados('eg1a', $arrayautoresact, $arrayinvolact);
              $cadena
              .= " AND eg1.idelemento NOT IN (SELECT distinct ega.idelemento
              FROM mod_objetivos.dat_elementos ega
              LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados egai
              ON egai.idelemento = ega.idelemento
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos egeea
              ON ega.idelemento = egeea.idelementohijo
              INNER JOIN  mod_objetivos.dat_elementos eg1a
              ON eg1a.idelemento = egeea.idelementopadre
              INNER JOIN mod_objetivos.dat_fip fin
              ON fin.idfip = eg1a.idelemento
              LEFT JOIN mod_objetivos.dat_fechacontrol feco
              ON feco.idelemento = eg1a.idelemento
              LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eg1ai
              ON eg1ai.idelemento = eg1a.idelemento
              WHERE ega.idtipoelemento = '2' " . $nuevacadenaForaneos
              . "
              AND eg1a.idtipoelemento = '2'
              AND (ega.cantrelacascdcorigen0 > 0
              OR ega.cantrelacascdcorigen2 > 0) "
              .
              $cadenaautoresinvoldescDparte
              . $cadenaautoresinvoldescDoceparte;
              $cadena .= ")";
              $cadena .= ")"; */
        } else {
            //para listar los hijos cuyos padres no cumplan
            //con las condiciones o filtros
            $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados('eg', $arrayautoresact, $arrayinvolact);
            $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados('eg1', $arrayautoresact, $arrayinvolact);
            $cadena
                .= " OR e.idelemento IN	(SELECT distinct eg.idelemento
                    FROM mod_objetivos.dat_elementos eg
                    INNER JOIN mod_objetivos.dat_fip fi 
                    ON fi.idfip = eg.idelemento
                    LEFT JOIN mod_objetivos.dat_fechacontrol fcon 
                    ON fcon.idelemento = eg.idelemento
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados egi 
                    ON egi.idelemento = eg.idelemento
                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos egee 
                    ON eg.idelemento = egee.idelementohijo
                    INNER JOIN  mod_objetivos.dat_elementos eg1 
                    ON eg1.idelemento = egee.idelementopadre
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eg1i 
                    ON eg1i.idelemento = eg1.idelemento				 
                    WHERE eg.idtipoelemento = '2' 
                    AND eg1.idtipoelemento = '2' AND egee.idelementopadre="
                . $idfip . " " . $wherefiltro . "
                    AND (eg.cantrelacascdcorigen0 > 0 
                    OR eg.cantrelacascdcorigen2 > 0) "
                .
                $cadenaautoresinvoldescDparte
                . $cadenaautoresinvoldescDoceparte;
            $nuevacadenaForaneos = "";
            if ($busqueda == 1) {
                $nuevacadenaForaneos = str_ireplace('eg', 'ega', $wherefiltro);
                $nuevacadenaForaneos = str_ireplace('fi', 'fin', $nuevacadenaForaneos);
                $nuevacadenaForaneos = str_ireplace('fcon', 'feco', $nuevacadenaForaneos);
            }
            $cadenaautoresinvoldescDparte = $this->CrearCadenaAutoresInvolucrados('ega', $arrayautoresact, $arrayinvolact);
            $cadenaautoresinvoldescDoceparte = $this->CrearNoCadenaAutoresInvolucrados('eg1a', $arrayautoresact, $arrayinvolact);
            $cadena
                .= " AND eg1.idelemento NOT IN (SELECT distinct ega.idelemento
                    FROM mod_objetivos.dat_elementos ega                        
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados egai 
                    ON egai.idelemento = ega.idelemento
                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos egeea 
                    ON ega.idelemento = egeea.idelementohijo
                    INNER JOIN  mod_objetivos.dat_elementos eg1a 
                    ON eg1a.idelemento = egeea.idelementopadre
                    INNER JOIN mod_objetivos.dat_fip fin 
                    ON fin.idfip = eg1a.idelemento
                    LEFT JOIN mod_objetivos.dat_fechacontrol feco 
                    ON feco.idelemento = eg1a.idelemento
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados eg1ai 
                    ON eg1ai.idelemento = eg1a.idelemento				 
                    WHERE ega.idtipoelemento = '2' AND egeea.idelementopadre="
                . $idfip . " " . $nuevacadenaForaneos . "
                    AND eg1a.idtipoelemento = '2' 
                    AND (ega.cantrelacascdcorigen0 > 0 
                    OR ega.cantrelacascdcorigen2 > 0) "
                .
                $cadenaautoresinvoldescDparte
                . $cadenaautoresinvoldescDoceparte;
            $cadena .= ")";
            $cadena .= ")";
        }

        //$cadena.=" {$addwhere} ";//die($cadena);
        $cadena
            .= " group BY
                e.idelemento,
                e.denelemento,
                e.descelemento,
                e.llevahistorial,
                e.estadocumplimiento,e.gradocumplimiento,e.activo,
                e.idusuariocrea , u.nombreusuario,e.participante ,
                e.cantobserv,e.cantobserv ,f.fechaemision,  
                f.fechacumplimiento,
                nn.idnomenclador,
                nn.dennomenclador,
                e.cantrelacdescorigen0,e.cantrelacdescorigen1,e.cantrelacdescorigen2 ";

        $cadena
            .= " order by f.fechaemision ASC, f.fechacumplimiento ASC ";
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll(PDO::FETCH_ASSOC);
        $total = count($resultnopag);
        if ($start == null) {
            $start = 0;
        }
        $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit
            . ")";
       // print_r($cadena);die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultado['total'] = $total;
        $resultado['resultado'] = $result;
        return $resultado;
    }

    /**
     * Nombre de la función GetarrayFIPS
     * Descripcion  Devuelve un conjunto de FIPS dado un arreglo de idFIP.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array $arrayidFIP - arreglo de idFIP.
     *
     * @return array
     */
    public function GetarrayFIPS($arrayidFIP)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                e.descelemento,e.llevahistorial, e.estadocumplimiento,
                e.gradocumplimiento,e.activo, e.idusuariocrea AS idautor,
                e.participante AS participantes, e.cantobserv AS observaciones,
                e.cantobserv AS observaciones ,f.fechaemision AS fechainicio,  
                f.fechacumplimiento AS fechafin
                FROM mod_objetivos.dat_elementos e 
                INNER JOIN mod_objetivos.dat_fip f ON f.idfip = e.idelemento
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON e.idelemento = ei.idelemento 	       
                WHERE e.idtipoelemento = '2' AND e.idelemento IN("
            . implode(",", $arrayidFIP) . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultado['total'] = count($result);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function ObtenerActividadesReporte($datos)
    {
        $cadenanom = '';
        $cadenaestados = '';
        $joinnom = '';
        $joininvolaut = '';
        $cadenaautoresinvol = '';
        $fechainicio = $datos->fechainicio;
        $fechafin = $datos->fechafin;
        $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
        $fechafinD = $datos->arraydatosreporte['fechafinD'];

        $idplan = $datos->idplan;
        $arrayestados = implode(',', $datos->arrayestados);
        $arrayidautores = implode(',', $datos->arrayidautores);


        $aux_involucrados =
              array_merge(
                $datos->arrayinvolucrados, $datos->arrayidinvolucrados, $datos->arrayidautores
              );

       $arrayidinvolucrados = implode(',', $aux_involucrados);
        //print_r($arrayidinvolucrados);die;



      //cadena sql con posibles autores e involucrados

      if (isset($datos->arrayidautores[0]) && !isset($datos->arrayidinvolucrados[0])) {
          $cadenaautoresinvol
            .=  " AND e.idusuariocrea IN (".$arrayidautores.") ";
          }
      else if (!isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
        $joininvolaut = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON ei.idelemento = e.idelemento ";
        $cadenaautoresinvol
                      .=  " AND ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
      }
      else if (isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
        $joininvolaut = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON ei.idelemento = e.idelemento ";
        $cadenaautoresinvol
                      .=  " AND (e.idusuariocrea IN (".$arrayidautores.") 
                      OR ei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
      }
      else if (isset($arrayidinvolucrados[0])) {
            $joininvolaut = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON ei.idelemento = e.idelemento ";
            $cadenaautoresinvol
                .=  " AND (e.idusuariocrea IN (".$arrayidinvolucrados.") 
                      OR ei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
        }


        //cadena sql con los estados en que puedo ver el documento 		
        if (isset($arrayestados[0])) {
            $cadenaestados .= " AND e.idestadoaprob IN (" . $arrayestados . ")";
        }

      $arrayidnom = implode(',', $datos->arrayidnom);
        //cadena sql con los nomencladores  	   		   	
        if (isset($arrayidnom[0])) {
            $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON e.idelemento = en.idelemento ";
            $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
        }


        /**************
             Las tareas suspendidas
         ***************/

        $cadenaSuspandidas = " SELECT a.idactividad
                              FROM mod_objetivos.dat_actividades  a
                              WHERE a.suspendida=1 ";



        //empiezo a construir sql obtener repeticiones de la actividad
        $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento
            WHERE ar.tiporepeticion IS NOT NULL ";
        //empiezo a construir sql obtener repeticiones de la actividad
        $cadenareasignacion = "SELECT distinct p.idelemento FROM mod_objetivos.dat_elementos p
            WHERE p.idtipoelemento = '3' AND p.cantrelacascdcorigen5 > 0 
            AND p.idusuariocrea IN(";
        $cadena = " SELECT distinct(e.idelemento), e.denelemento, e.idusuariocrea,
                e.dirigente AS dirigentes, --e.descelemento,
            replace(replace(replace(e.descelemento,'&nbsp;<br>', ''),'<br>', ''),'&nbsp;', '') as  descelemento,    
            e.participante AS participantes,e.estadocumplimiento,a.fechainicio,a.fechafin,a.lugar,
            e.gradocumplimiento || '%' AS cumplimiento, 
            --to_char(a.fechainicio, 'DD/MM/YYYY')  ||'-'|| to_char(a.fechafin, 'DD/MM/YYYY') as fechaif,
            /*Para que cuando el usuario no tenga persona muestre usuario*/
           CASE WHEN p.idpersona is NULL THEN u.nombreusuario ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor,
           -- a.horainicio ||'-'|| a.horafin as horaif,
            a.tipo AS tipoactividad, a.categoria,
            es.denominacion AS nombreestadoaprob, a.suspendida,
            0 AS pintado, 
            coalesce (a.tiporepeticion,0) as esrepeticion,
            
            CASE WHEN (SELECT LIST(elem.idelementohijo||'') FROM  mod_objetivos.dat_elementos_dat_elementos elem
                    INNER JOIN mod_objetivos.dat_elementos dee 
                    ON (dee.idelemento=elem.idelementohijo)
                    INNER JOIN mod_objetivos.dat_actividades act 
                    ON (act.idactividad = dee.idelemento 
                    --AND act.suspendida=0
                    ) 
                    WHERE elem.idelementopadre = e.idelemento
                        AND elem.origen = 4) = '' THEN NULL ELSE 
                    (SELECT LIST(elem.idelementohijo||'') FROM  mod_objetivos.dat_elementos_dat_elementos elem
                    INNER JOIN mod_objetivos.dat_elementos dee 
                    ON (dee.idelemento=elem.idelementohijo)
                    INNER JOIN mod_objetivos.dat_actividades act 
                    ON (act.idactividad = dee.idelemento
                     --AND act.suspendida=0
                    ) 
                    WHERE elem.idelementopadre = e.idelemento
                        AND elem.origen = 4) END as idrepeticiones, 
            
            a.esprincipal, a.horainicio,a.horafin,a.tiempoestimado,nc.color	,(SELECT LIST(cuerpo)
              FROM 
                mod_objetivos.dat_observaciones_pdo 
                  WHERE idelemento = e.idelemento) as observaciones";
        /* if ($datos->incidencia) {
          $cadena
          .= ",coalesce( dob.asunto,'') as asuntodesviacion,
          coalesce( dob.cuerpo,'') as cuerpodesviacion,
          inc.denelemento as denelementoincidencia,
          inc.descelemento as descelementoincidencia";
          } */
        $cadena
            .= "	FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON (a.idactividad = e.idelemento 
                --AND a.suspendida=0
                ) 
                LEFT JOIN mod_flujotrabajo.dat_estado es
                ON e.idestadoaprob = es.idestado
                INNER JOIN mod_seguridad.seg_usuario u
                ON u.idusuario = e.idusuariocrea
                LEFT JOIN mod_persona.dat_persona p
                ON u.idpersona = p.idpersona
                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en1 
                ON (en1.idelemento = e.idelemento AND en1.tiponomenclador = '2')
                LEFT JOIN mod_objetivos.nom_nomenclador n 
                ON n.idnomenclador = en1.idnomenclador
                LEFT JOIN mod_objetivos.nom_categactividad nc 
                ON nc.idnomenclador = n.idnomenclador ";


        $whereplan = '';

        if ($datos->str_idelementos != "") {
            $whereplan .= " AND e.idelemento in ($datos->str_idelementos) ";
        }


        if ($datos->str_idelementos == "" && $datos->idplan != "")
            return array();

//        if ($idplan != null) {
//            $cadenareasignacion .= $datos->idusuariosession . ")";
//            $cadena
//                    .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
//                ON (e.idelemento = ee.idelementohijo
//                AND ee.idelementopadre  = '$idplan') ";
//            $cadena .= $joinnom . $joininvolaut;
//            /* if ($datos->incidencia) {
//              $cadena.= " INNER JOIN mod_objetivos.dat_elementos desv ON (ee.idelementopadre = desv.idelemento)
//              AND (desv.idtipoelemento = 6)
//              INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeinc ON (desv.idelemento = eeinc.idelementopadre)
//              INNER JOIN mod_objetivos.dat_elementos inc ON (inc.idelemento = eeinc.idelementohijo) AND (inc.idtipoelemento = 5)
//              left JOIN mod_objetivos.dat_observaciones_pdo dob ON (dob.idelemento = e.idelemento)";
//              } */
//            $cadena .= " WHERE e.idtipoelemento = '3' ";
//            if ($fechainicio != null) {
//                $cadena
//                        .= " AND ( (a.fechainicio <= '$fechainicio'
//                    AND a.fechafin >= '$fechainicio') ";
//                if ($fechafin != null) {
//                    $cadena
//                            .= " OR (a.fechainicio <= '$fechafin'
//                        AND a.fechafin >= '$fechafin')
//                        OR (a.fechainicio >= '$fechainicio'
//                            AND a.fechafin <= '$fechafin')";
//                }
//                $cadena .= ")";
//            }
//            if ($fechafin != null && $fechainicio == null) {
//                $cadena
//                        .= " AND (a.fechainicio <= '$fechafin'
//                    AND a.fechafin >= '$fechafin')";
//            }
//            if ($fechainicioD != null) {
//                $cadena
//                        .= " AND ( (a.fechainicio <= '$fechainicioD'
//                    AND a.fechafin >= '$fechainicioD') ";
//                if ($fechafinD != null) {
//                    $cadena
//                            .= " OR (a.fechainicio <= '$fechafinD'
//                        AND a.fechafin >= '$fechafinD')
//                    OR (a.fechainicio >= '$fechainicioD'
//                        AND a.fechafin <= '$fechafinD')";
//                }
//                $cadena .= ")";
//            }
//            if ($fechafinD != null && $fechainicioD == null) {
//                $cadena
//                        .= " AND (a.fechainicio <= '$fechafinD'
//                    AND a.fechafin >= '$fechafinD')";
//            }
//            $cadena .= $cadenaautoresinvol;
//            $cadena .= $cadenanom;
//            $cadena .= $cadenaestados;
//            if ($datos->repeticiones == 0) {
//                $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion
//                        . ")";
//            }
//            $cadena .= " AND e.idelemento NOT IN (" . $cadenareasignacion . ")";
//            $cadena
//                    .= " UNION SELECT distinct(e.idelemento),e.denelemento,
//                e.dirigente AS dirigentes, --e.descelemento,
//            replace(replace(replace(e.descelemento,'&nbsp;<br>', ''),'<br>', ''),'&nbsp;', '') as  descelemento,
//            e.participante AS participantes,e.estadocumplimiento,a.fechainicio,a.fechafin,a.lugar,
//            e.gradocumplimiento || '%' AS cumplimiento,
//            --es.denominacion  AS nombreestadoaprob,
//            --to_char(a.fechainicio, 'DD/MM/YYYY')  ||'-'|| to_char(a.fechafin, 'DD/MM/YYYY') as fechaif,
//            /*Para que cuando el usuario no tenga persona muestre usuario*/
//           CASE WHEN p.idpersona is NULL THEN u.nombreusuario ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor,
//           -- a.horainicio ||'-'|| a.horafin as horaif,
//            a.tipo AS tipoactividad, a.categoria,
//            es.denominacion AS nombreestadoaprob,
//            a.esprincipal, a.horainicio,a.horafin,a.tiempoestimado,nc.color,(SELECT LIST(cuerpo)
//                    FROM
//                      mod_objetivos.dat_observaciones_pdo
//                        WHERE idelemento = e.idelemento) as observaciones ";
//            /* if ($datos->incidencia) {
//              $cadena
//              .= ",null as asuntodesviacion,
//              null as cuerpodesviacion,
//              null as denelementoincidencia,
//              null as descelementoincidencia";
//              } */
//            $cadena
//                    .= " FROM mod_objetivos.dat_elementos e
//                INNER JOIN mod_objetivos.dat_actividades a
//                ON (a.idactividad = e.idelemento AND a.suspendida=0)
//                LEFT JOIN mod_flujotrabajo.dat_estado es
//                ON e.idestadoaprob = es.idestado
//                INNER JOIN mod_seguridad.seg_usuario u
//                ON u.idusuario = e.idusuariocrea
//                LEFT JOIN mod_persona.dat_persona p
//                ON u.idpersona = p.idpersona
//                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en1
//                ON (en1.idelemento = e.idelemento AND en1.tiponomenclador = '2')
//                LEFT JOIN mod_objetivos.nom_nomenclador n
//                ON n.idnomenclador = en1.idnomenclador
//                LEFT JOIN mod_objetivos.nom_categactividad nc
//                ON nc.idnomenclador = n.idnomenclador
//                INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer
//                ON e.idelemento = eer.idelementohijo
//                INNER JOIN mod_objetivos.dat_elementos er
//                ON er.idelemento = eer.idelementopadre
//                INNER JOIN mod_objetivos.dat_objetivo o
//                ON er.idelemento = o.idobjetivo
//                INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo
//                ON apo.idobjetivo = o.idobjetivo AND apo.idplan = '$idplan' ";
//            $cadena .= $joinnom . $joininvolaut;
//            /* if ($datos->incidencia) {
//              $cadena
//              .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementohijo)
//              INNER JOIN mod_objetivos.dat_elementos desv ON (ee.idelementopadre = desv.idelemento)
//              AND (desv.idtipoelemento = 6)
//              INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeinc ON (desv.idelemento = eeinc.idelementopadre)
//              INNER JOIN mod_objetivos.dat_elementos inc ON (inc.idelemento = eeinc.idelementohijo) AND (inc.idtipoelemento = 5)
//              left JOIN mod_objetivos.dat_observaciones_pdo dob ON (dob.idelemento = e.idelemento)";
//              } */
//            $cadena .= " WHERE e.idtipoelemento = '3' ";
//            if ($fechainicio != null) {
//                $cadena
//                        .= " AND ( (a.fechainicio <= '$fechainicio'
//                    AND a.fechafin >= '$fechainicio') ";
//                if ($fechafin != null) {
//                    $cadena
//                            .= " OR (a.fechainicio <= '$fechafin'
//                        AND a.fechafin >= '$fechafin')
//                        OR (a.fechainicio >= '$fechainicio'
//                            AND a.fechafin <= '$fechafin')";
//                }
//                $cadena .= ")";
//            }
//            if ($fechafin != null && $fechainicio == null) {
//                $cadena
//                        .= " AND (a.fechainicio <= '$fechafin'
//                    AND a.fechafin >= '$fechafin')";
//            }
//            if ($fechainicioD != null) {
//                $cadena
//                        .= " AND ( (a.fechainicio <= '$fechainicioD'
//                    AND a.fechafin >= '$fechainicioD') ";
//                if ($fechafinD != null) {
//                    $cadena
//                            .= " OR (a.fechainicio <= '$fechafinD'
//                        AND a.fechafin >= '$fechafinD')
//                        OR (a.fechainicio >= '$fechainicioD'
//                            AND a.fechafin <= '$fechafinD')";
//                }
//                $cadena .= ")";
//            }
//            if ($fechafinD != null && $fechainicioD == null) {
//                $cadena
//                        .= " AND (a.fechainicio <= '$fechafinD'
//                    AND a.fechafin >= '$fechainicioD')";
//            }
//            $cadena .= $cadenaautoresinvol;
//            $cadena .= $cadenaestados;
//            $cadena .= $cadenanom;
//            if ($datos->repeticiones == 0) {
//                $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion
//                        . ")";
//            }
//            $cadena .= " AND e.idelemento NOT IN (" . $cadenareasignacion . ")";
//            $cadena
//                    .= " UNION SELECT distinct(e.idelemento),e.denelemento,
//                e.dirigente AS dirigentes, --e.descelemento,
//            replace(replace(replace(e.descelemento,'&nbsp;<br>', ''),'<br>', ''),'&nbsp;', '') as  descelemento,
//            e.participante AS participantes,e.estadocumplimiento,a.fechainicio,a.fechafin,a.lugar,
//            e.gradocumplimiento || '%' AS cumplimiento,
//            --es.denominacion  AS nombreestadoaprob,
//            --to_char(a.fechainicio, 'DD/MM/YYYY')  ||'-'|| to_char(a.fechafin, 'DD/MM/YYYY') as fechaif,
//            /*Para que cuando el usuario no tenga persona muestre usuario*/
//           CASE WHEN p.idpersona is NULL THEN u.nombreusuario ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor,
//           -- a.horainicio ||'-'|| a.horafin as horaif,
//            a.tipo AS tipoactividad, a.categoria,
//            es.denominacion AS nombreestadoaprob,
//            a.esprincipal, a.horainicio,a.horafin,a.tiempoestimado,nc.color,
//                (SELECT LIST(cuerpo)
//                    FROM
//                      mod_objetivos.dat_observaciones_pdo
//                        WHERE idelemento = e.idelemento) as observaciones ";
//            /* if ($datos->incidencia) {
//              $cadena
//              .= ",coalesce( dob.asunto,'') as asuntodesviacion,
//              coalesce( dob.cuerpo,'') as cuerpodesviacion,
//              inc.denelemento as denelementoincidencia,
//              inc.descelemento as descelementoincidencia";
//              } */
//            $cadena
//                    .= " FROM mod_objetivos.dat_elementos e
//                INNER JOIN mod_objetivos.dat_actividades a
//                ON (a.idactividad = e.idelemento AND a.suspendida=0)
//                LEFT JOIN mod_flujotrabajo.dat_estado es
//                ON e.idestadoaprob = es.idestado
//                INNER JOIN mod_seguridad.seg_usuario u
//                ON u.idusuario = e.idusuariocrea
//                LEFT JOIN mod_persona.dat_persona p
//                ON u.idpersona = p.idpersona
//                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en1
//                ON (en1.idelemento = e.idelemento AND en1.tiponomenclador = '2')
//                LEFT JOIN mod_objetivos.nom_nomenclador n
//                ON n.idnomenclador = en1.idnomenclador
//                LEFT JOIN mod_objetivos.nom_categactividad nc
//                ON nc.idnomenclador = n.idnomenclador
//                INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apa
//                ON (apa.idactividad = a.idactividad
//                AND apa.idplan = '$idplan') ";
//            $cadena .= $joinnom . $joininvolaut;
//            /* if ($datos->incidencia) {
//              $cadena
//              .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementohijo)
//              INNER JOIN mod_objetivos.dat_elementos desv ON (ee.idelementopadre = desv.idelemento)
//              AND (desv.idtipoelemento = 6)
//              INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeinc ON (desv.idelemento = eeinc.idelementopadre)
//              INNER JOIN mod_objetivos.dat_elementos inc ON (inc.idelemento = eeinc.idelementohijo) AND (inc.idtipoelemento = 5)
//              left JOIN mod_objetivos.dat_observaciones_pdo dob ON (dob.idelemento = e.idelemento)";
//              } */
//            $cadena .= " WHERE e.idtipoelemento = '3' ";
//            if ($fechainicio != null) {
//                $cadena
//                        .= " AND ( (a.fechainicio <= '$fechainicio'
//                    AND a.fechafin >= '$fechainicio') ";
//                if ($fechafin != null) {
//                    $cadena
//                            .= " OR (a.fechainicio <= '$fechafin'
//                        AND a.fechafin >= '$fechafin')
//                        OR (a.fechainicio >= '$fechainicio'
//                            AND a.fechafin <= '$fechafin')";
//                }
//                $cadena .= ")";
//            }
//            if ($fechafin != null && $fechainicio == null) {
//                $cadena
//                        .= " AND (a.fechainicio <= '$fechafin'
//                    AND a.fechafin >= '$fechafin')";
//            }
//            if ($fechainicioD != null) {
//                $cadena
//                        .= " AND ( (a.fechainicio <= '$fechainicioD'
//                    AND a.fechafin >= '$fechainicioD') ";
//                if ($fechafinD != null) {
//                    $cadena
//                            .= " OR (a.fechainicio <= '$fechafinD'
//                        AND a.fechafin >= '$fechafinD')
//                        OR (a.fechainicio >= '$fechainicioD'
//                            AND a.fechafin <= '$fechafinD')";
//                }
//                $cadena .= ")";
//            }
//            if ($fechafinD != null && $fechainicioD == null) {
//                $cadena
//                        .= " AND (a.fechainicio <= '$fechafinD'
//                    AND a.fechafin >= '$fechainicioD')";
//            }
//            $cadena .= $cadenaautoresinvol;
//            $cadena .= $cadenaestados;
//            $cadena .= $cadenanom;
//            if ($datos->repeticiones == 0) {
//                $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion
//                        . ")";
//            }
//            $cadena .= " AND e.idelemento NOT IN (" . $cadenareasignacion . ")";
//        } else {
//

        if ($arrayidautores) {
            $cadenareasignacion .= $arrayidautores . ")";
        } else {
            $cadenareasignacion = " SELECT distinct p.idelemento
                        FROM mod_objetivos.dat_elementos p ";
        }
        $cadena .= $joinnom . $joininvolaut;
        /* if ($datos->incidencia) {
          $cadena
          .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementohijo)
          INNER JOIN mod_objetivos.dat_elementos desv ON (ee.idelementopadre = desv.idelemento)
          AND (desv.idtipoelemento = 6)
          INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeinc ON (desv.idelemento = eeinc.idelementopadre)
          INNER JOIN mod_objetivos.dat_elementos inc ON (inc.idelemento = eeinc.idelementohijo) AND (inc.idtipoelemento = 5)
          left JOIN mod_objetivos.dat_observaciones_pdo dob ON (dob.idelemento = e.idelemento)";
          } */
        $cadena .= " WHERE e.idtipoelemento = '3' ";
        if ($fechainicio != null) {
            $cadena
                .= " AND ( (a.fechainicio <= '$fechainicio'
                    AND a.fechafin >= '$fechainicio') ";
            if ($fechafin != null) {
                $cadena
                    .= " OR (a.fechainicio <= '$fechafin'
                        AND a.fechafin >= '$fechafin')
                        OR (a.fechainicio >= '$fechainicio'
                            AND a.fechafin <= '$fechafin')";
            }
            $cadena .= ")";
        }
        if ($fechafin != null && $fechainicio == null) {
            $cadena
                .= " AND (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')";
        }
        if ($fechainicioD != null) {
            $cadena
                .= " AND ( (a.fechainicio <= '$fechainicioD'
                    AND a.fechafin >= '$fechainicioD') ";
            if ($fechafinD != null) {
                $cadena
                    .= " OR (a.fechainicio <= '$fechafinD'
                        AND a.fechafin >= '$fechafinD')
                        OR (a.fechainicio >= '$fechainicioD'
                            AND a.fechafin <= '$fechafinD')";
            }
            $cadena .= ")";
        }
        if ($fechafinD != null && $fechainicioD == null) {
            $cadena
                .= " AND (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechafinD')";
        }
        $cadena .= $cadenaautoresinvol;
        $cadena .= $cadenaestados;
        $cadena .= $cadenanom;

            if ($datos->repeticiones == 0) {
                $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion
                        . ")";
            }

    if ($datos->suspendidas == 1) {
        $cadena .= " AND e.idelemento NOT IN (" . $cadenaSuspandidas
          . ")";
    }


        $cadena
            .= 'AND e.idelemento NOT IN
                 (SELECT distinct b.idelemento 
                 FROM mod_objetivos.dat_elementos b
                  WHERE b.idtipoelemento = 3
                  AND b.cantrelacascdcorigen5 > 0 )' . $whereplan . '
                  ORDER BY esrepeticion, fechainicio, horainicio, tiempoestimado';
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerElementosExistentes($arrayElementos)
    {
        $query = new Doctrine_Query();
        $result = $query->select('de.idelemento')->from('DatElementos de')
            ->whereIn("de.idelemento", $arrayElementos)->execute();
        return $result->toArray();
    }

    public function BuscarElementoPersistido($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->select('de.*')
            ->from('DatElementos de')
            ->where("de.idelemento = $idelemento")
            ->execute();
        return $result->toArray();
    }

    public function ActualizarInfElemento()
    {
        $connection = Doctrine_Manager:: connection();
        $sql = "UPDATE mod_objetivos.dat_elementos SET ";
        $array = $this->getData();
        foreach ($array as $key => $value) {
            if (strlen((string)$value) > 0) {
                $sql = $sql . $key . " = " . "'" . str_replace("'","", $value) . "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1) . " WHERE idelemento = "
            . $array['idelemento'];

        $connection->execute($sql);


    }

    /* Nombre de la función ResetCantObserv
     * Descripcion  Establece el numero de Observaciones de un elemento dado
     *  un id de elemento y la cantidad nueva de observaciones.     *
     * @author * Rodolfo Rodriguez Molinet     *
     * @param variable $idelemento - id del elemento, variable
     * $cantobserv - cantidad de observaciones del elemento.  *
     * @return boolean
     */

    public function ResetCantObserv($idelemento, $cantobserv)
    {
        try {
            $de = Doctrine_Manager::getInstance();
            $conn = $de->getCurrentConnection();
            $conn->commit();
            $datElementos = new DatElementos();
            $datElementos = $this->Buscar($idelemento);
            $datElementos->cantobserv = $cantobserv;
            $datElementos->save();
            $conn->beginTransaction();
            return true;
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function ObtenerDenominacionElemento($elemento)
    {
        $query = new Doctrine_Query();
        $result = $query->select('de.denelemento,de.idtipoelemento')->from(
            'DatElementos de'
        )
            ->where("de.idelemento = $elemento ")->execute();
        return $result->toArray();
    }

    public function ModificarBanderaDeNotificacionBD(
        $idtipo, $estadossiguientes, $estadosanteriores
    )
    {
        $conn = Doctrine_Manager:: connection();
        $cadenaA = "UPDATE mod_objetivos.dat_elementos SET gennotificacion = 1
    	           WHERE mod_objetivos.dat_elementos.idtipoelemento = $idtipo 
                       AND mod_objetivos.dat_elementos.idestadoaprob  IN ("
            . implode(",", $estadossiguientes) . ")";
        if (isset($estadosanteriores[0])) {
            $cadenaB = "UPDATE mod_objetivos.dat_elementos SET gennotificacion = 0
    	           WHERE mod_objetivos.dat_elementos.idtipoelemento = $idtipo 
                    AND mod_objetivos.dat_elementos.idestadoaprob  IN ("
                . implode(",", $estadosanteriores) . ")";
            $conn->execute($cadenaB);
        }
        $conn->execute($cadenaA);
        return true;
    }

    public function ObtenerRelaciones()
    {
        $query = new Doctrine_Query();
        $result = $query->select('*')->from('DatElementosDatElementos')
            ->execute();
        return $result->toArray();
    }

    public function EliminarRelaciones()
    {
        $query = new Doctrine_Query();
        $query->delete('DatElementosDatElementos')->from(
            'DatElementosDatElementos'
        )->execute();
    }

    public function ActualizarContadoresRelaciones()
    {
        $connA = Doctrine_Manager:: connection();
        $connA->execute(
            'UPDATE mod_objetivos.dat_elementos SET
                cantrelacdescorigen0 = 0,
                cantrelacdescorigen1 = 0,
                cantrelacdescorigen2 = 0,
                cantrelacdescorigen3 = 0,
                cantrelacdescorigen4 = 0,
                cantrelacdescorigen5 = 0,				
                cantrelacascdcorigen0 = 0,
                cantrelacascdcorigen1 = 0,
                cantrelacascdcorigen2 = 0,
                cantrelacascdcorigen3 = 0,
                cantrelacascdcorigen4 = 0,
                cantrelacascdcorigen5 = 0'
        );
    }

    public function ObtenerActividadesVinculadasObj($idobj, $idplan, $datos)
    {
        $cadenaestados = "";
        $cadenanom = '';
        $joinnom = '';
        $joininvolaut = '';
        $cadenaautoresinvol = '';
        $arrayestados = implode(',', $datos->arrayestados);
        $arrayidautores = implode(',', $datos->arrayidautores);
        $arrayidinvolucrados = implode(',', $datos->arrayidinvolucrados);
        $arrayidnom = implode(',', $datos->arrayidnom);
        $fechainicio = $datos->fechainicio;
        $fechafin = $datos->fechafin;
        $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
        $fechafinD = $datos->arraydatosreporte['fechafinD'];
        if (isset($arrayidautores[0]) || isset($arrayidinvolucrados[0])) {
            if (isset($arrayidautores[0])) {
                $cadenaautoresinvol = " AND (e.idusuariocrea IN (" . $arrayidautores . ")";
                if (isset($arrayidinvolucrados[0])) {
                    $cadenaautoresinvol .= " OR ";
                }
            }
            if (isset($arrayidinvolucrados[0])) {
                if (!isset($arrayidautores[0])) {
                    $cadenaautoresinvol = " AND ";
                }
                $joininvolaut = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                        ei ON ei.idelemento = e.idelemento ";
                $cadenaautoresinvol
                    .= " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
            }
            $cadenaautoresinvol .= (isset($arrayidautores[0])) ? ")" : "";
        }
        if (isset($arrayestados[0])) {
            $cadenaestados .= " AND e.idestadoaprob IN (" . $arrayestados . ")";
        }
        //cadena sql con los nomencladores  	   		   	
        if (isset($arrayidnom[0])) {
            $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON e.idelemento = en.idelemento ";
            $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
        }
        if ($fechainicio != null) {
            $wherfecha
                .= " AND ( (a.fechainicio <= '$fechainicio'
                AND a.fechafin >= '$fechainicio') ";
            if ($fechafin != null) {
                $wherfecha
                    .= " OR (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')
                    OR (a.fechainicio >= '$fechainicio' 
                        AND a.fechafin <= '$fechafin')";
            }
            $wherfecha .= ")";
        }
        if ($fechafin != null && $fechainicio == null) {
            $wherfecha
                .= " AND (a.fechainicio <= '$fechafin'
                AND a.fechafin >= '$fechafin')";
        }
        if ($fechainicioD != null) {
            $wherfecha
                .= " AND ( (a.fechainicio <= '$fechainicioD'
                AND a.fechafin >= '$fechainicioD') ";
            if ($fechafinD != null) {
                $wherfecha
                    .= " OR (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechafinD')
                    OR (a.fechainicio >= '$fechainicioD' 
                        AND a.fechafin <= '$fechafinD')";
            }
            $wherfecha .= ")";
        }
        if ($fechafinD != null && $fechainicioD == null) {
            $wherfecha
                .= " AND (a.fechainicio <= '$fechafinD'
                AND a.fechafin >= '$fechafinD')";
        }
        //empiezo a construir sql obtener repeticiones de la actividad
        $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento
            WHERE ar.tiporepeticion IS NOT NULL ";
        $idelementopadre = $idobj;
        if ($idobj == 'objetivo') {
            $idelementopadre = $idplan;
        }
        $cadena = "SELECT distinct(e.idelemento),e.denelemento,
                e.dirigente AS dirigentes, e.participante AS participantes,
                a.fechainicio,a.fechafin,a.lugar,a.esprincipal,	a.horainicio,
                a.horafin,a.tiporepeticion
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON (a.idactividad = e.idelemento AND a.suspendida=0)   
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee  
                ON e.idelemento = ee.idelementohijo
                " . $joininvolaut . " " . $joinnom . "
                WHERE e.idtipoelemento = '3' AND ee.idelementopadre = '$idelementopadre'  "
            . $cadenaautoresinvol . " " . $cadenanom . " ";
        $cadena .= $cadenaestados . $wherfecha;

        $cadena .= " AND e.idelemento NOT IN (" . $cadenarepeticion . ")";

        $connA = Doctrine_Manager:: connection();
        //print_r($cadena);die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerObservacionesActividadesVinculadasObj($idactividad)
    {
        $cadena = "SELECT dobs.cuerpo
                FROM mod_objetivos.dat_actividades ac
                INNER JOIN mod_objetivos.dat_observaciones_pdo dobs 
                ON (ac.idactividad = dobs.idelemento)
                WHERE dobs.idelemento = '$idactividad'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerDatosIncidencia($idelemento, $filtroelemento)
    {
        $valor = 0;
        $cadena = "";
        if (count($filtroelemento) != 0) {
            foreach ($filtroelemento as $filtro) {
                if ($filtro['field'] == 'denelemento') {
                    $cadena .= " AND dat_elementos.denelemento LIKE '%"
                        . $filtro['data']['value'] . "%'";
                }
                if ($filtro['field'] == 'activo') {
                    if ($filtro['data']['value'] == "Si") {
                        $valor = 1;
                    }
                    $cadena .= " AND dat_elementos.activo ='$valor'";
                }
            }
        }
        $consulta = "SELECT
        dat_elementos.denelemento, 
        dat_elementos.activo,
        dat_elementos.idusuariocrea,
        dat_elementos.descelemento
        FROM mod_objetivos.dat_elementos
        WHERE dat_elementos.idelemento = '$idelemento'
         " . $cadena;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        //print_r($consulta);  die;
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerDesviaciones(
        $idusuariocrea, $tipoelemento, $parametros
    )
    {
        $cadenaJoin = '';
        $cadenaWhere = '';
        /* if (($parametros->idincidencia) && $parametros->accion == 
          'asociadas') {
          $cadenaJoin = 'INNER JOIN mod_objetivos.dat_elementos_dat_elementos
          elemdatelem
          ON e.idelemento = elemdatelem.idelementohijo';
          $cadenaWhere = " AND elemdatelem.idelementopadre =
          '$parametros->idincidencia'";
          } else if (($parametros->idincidencia) && $parametros->accion ==
          'noasociadas') {
          $cadenaJoin = 'INNER JOIN mod_objetivos.dat_elementos_dat_elementos
          elemdatelem ON e.idelemento = elemdatelem.idelementohijo';
          $cadenaWhere = " AND elemdatelem.idelementopadre <>
          '$parametros->idincidencia'";
          } */
        if (isset($parametros->filtros[0])) {
            foreach ($parametros->filtros as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $cadenaWhere = $cadenaWhere . " AND upper(e.denelemento) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'impacto') {
                    if ($datos ['data'] ['value'] == 'Bajo') {
                        $cadenaWhere = $cadenaWhere . " AND elemdesv.impacto = '1'";
                    }
                    if ($datos ['data'] ['value'] == 'Medio') {
                        $cadenaWhere = $cadenaWhere . " AND elemdesv.impacto = '2'";
                    }
                    if ($datos ['data'] ['value'] == 'Alto') {
                        $cadenaWhere = $cadenaWhere . " AND elemdesv.impacto = '3'";
                    }
                } elseif ($datos ['field'] == 'activo') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $cadenaWhere = $cadenaWhere . " AND e.activo = '1'";
                    } else {
                        $cadenaWhere = $cadenaWhere . " AND e.activo = '0'";
                    }
                } elseif ($datos ['field'] == 'tipodesviacion') {
                    $cadenaWhere = $cadenaWhere . " AND elemnom.idnomenclador = '"
                        . $datos ['data'] ['value'] . "'";
                }
            }
        }
        $cadenaWhere .= " OFFSET(" . $parametros->start . ") LIMIT("
            . $parametros->limit . ")";
        $consulta = "SELECT distinct(e.idelemento), e.denelemento,
                e.idusuariocrea, e.activo, e.idtipoelemento,
                elemnom.idnomenclador as idtipodesviacion, elemdesv.impacto as impacto
                FROM mod_objetivos.dat_elementos e
                $cadenaJoin
                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador elemnom
                ON elemnom.idelemento = e.idelemento
                LEFT JOIN mod_objetivos.dat_desviacion elemdesv
                ON e.idelemento = elemdesv.iddesviacion
                LEFT JOIN mod_objetivos.dat_usuario_desviacion elemuserdesv
                ON elemdesv.iddesviacion = elemuserdesv.iddesviacion
                WHERE (e.idusuariocrea = '$idusuariocrea'
                OR elemuserdesv.idusuario = '$idusuariocrea')
                AND e.idtipoelemento = '$tipoelemento' $cadenaWhere";
        $conn = Doctrine_Manager:: connection();
        $res = $conn->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function VerificarDesviacion(
        $idusuariocrea, $tipoelemento, $iddesviacion
    )
    {
        $consulta = "SELECT *,e.idelemento as idelemento,
            elemnom.idnomenclador as idtipodesviacion, 
            elemdesv.impacto as impacto
            FROM mod_objetivos.dat_elementos e
            LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador elemnom 
            ON elemnom.idelemento = e.idelemento				  
            LEFT JOIN mod_objetivos.dat_desviacion elemdesv  
            ON e.idelemento = elemdesv.iddesviacion		
            LEFT JOIN mod_objetivos.dat_usuario_desviacion elemuserdesv 
            ON elemdesv.iddesviacion = elemuserdesv.iddesviacion		
            WHERE e.idelemento = '$iddesviacion' 
            AND (e.idusuariocrea = '$idusuariocrea' 
            OR elemuserdesv.idusuario = '$idusuariocrea') 
            AND e.idtipoelemento = '$tipoelemento'";
        $conn = Doctrine_Manager:: connection();
        $res = $conn->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function EliminarElementosPorID($idelemento)
    {
        $consulta = "DELETE FROM mod_objetivos.dat_elementos
		WHERE  dat_elementos.idelemento =  '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $res->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

    public function ActualizarActivosPorID($idelemento, $activo)
    {
        $consulta = "UPDATE mod_objetivos.dat_elementos
		SET  activo='$activo'
		WHERE dat_elementos.idelemento =  '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $res->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

    public function obtenerPorcientoCmplimiento($idactividad)
    {
        $consulta = "SELECT e.actualizarporciento, dede.porcientoinicio
                    FROM mod_objetivos.dat_elementos e
                    LEFT JOIN mod_objetivos.dat_elementos_dat_elementos 
                    dede ON dede.idelementohijo = e.idelemento
                    WHERE e.idelemento = '$idactividad'";
        $conn = Doctrine_Manager:: connection();
        $res = $conn->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function setGradoCumplimientoPadreAuto($idelemento, $porciento)
    {
        $consulta = "UPDATE mod_objetivos.dat_elementos
		SET  gradocumplimiento = '$porciento'
		WHERE dat_elementos.idelemento =  '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAuto_manualPadre($idactividad)
    {
        $consulta = "SELECT e.actualizarporciento
                    FROM mod_objetivos.dat_elementos e
                    WHERE e.idelemento = '$idactividad'";
        $conn = Doctrine_Manager:: connection();
        $res = $conn->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerDenominacionIncidencia($denominacion, $tipo)
    {
        $denominacion = str_replace(
            "'", "''", $denominacion
        ); //para que no de problemas con las comillas simples
        $cadena = "SELECT dat_elementos.idelemento
        FROM mod_objetivos.dat_elementos
        WHERE dat_elementos.denelemento = '$denominacion'  AND
        dat_elementos.idtipoelemento = '$tipo'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerActividadesPert($parametros)
    {
        $arrayFinalResultante = array();
        if (isset($parametros->arrayautores)) {
            $parametros->arrayautores = implode(',', $parametros->arrayautores);
        }
        if (isset($parametros->arrayinvolucrados)) {
            $parametros->arrayinvolucrados = implode(
                ',', $parametros->arrayinvolucrados
            );
        }
        $cadenaConsultaEvitar = "SELECT e3.idelemento FROM mod_objetivos.dat_elementos e3
                                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                  ON (e3.idelemento = ee2.idelementohijo AND ee2.origen = 6)";

        //se obtienen las actividades directas al plan con descendencia origen 6
        $arrayActividadesDirectasPlan = $this->ObtenerActividadesPertDirectasPlan(
            $parametros, $cadenaConsultaEvitar
        );

        //se obtienen las actividades al plan mediante arc
        $arrayActividadesPorArc = $this->ObtenerActividadesPertMedianteARC(
            $parametros, $cadenaConsultaEvitar
        );

        //se obtiene un arreglo parcial
        $arrayParcialResultante = array_merge(
            $arrayActividadesDirectasPlan, $arrayActividadesPorArc
        );

        //se obtienen las actividades al plan mediante objetivos
        $arrayActividadesPorObjetivos = $this->ObtenerActividadesPertMedianteObjetivos(
            $parametros, $cadenaConsultaEvitar
        );

        //se obtiene el arreglo final
        $arrayFinalResultante = array_merge(
            $arrayParcialResultante, $arrayActividadesPorObjetivos
        );
        //print_r($arrayFinalResultante);die;

        return $arrayFinalResultante;
    }

    public function obtenerPlanArrayActividades($arrayActividadesVinculadasPlan)
    {

        $actividades = '';
        foreach ($arrayActividadesVinculadasPlan as $actividad) {
            $actividades .= $actividad['idelemento'] . ',';
        }
        $actividades = substr($actividades, 0, strlen($actividades) - 1);

        $cadenaConsultaEjecutar = 'SELECT DISTINCT(e.idelemento) as idplan, e.denelemento, ee.idelementohijo as idactividad
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementopadre )
            where e.idtipoelemento = 0 and ee.idelementohijo in (' . $actividades . ')';

        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $arrayplanes = $resultadoParcial->fetchAll(PDO::FETCH_ASSOC);

        foreach ($arrayActividadesVinculadasPlan as $actividad => $value) {
            foreach ($arrayplanes as $plan) {
                if ($value['idelemento'] == $plan['idactividad']) {
                    $arrayActividadesVinculadasPlan[$actividad]['idplan'] = $plan['idplan'];
                    break;
                }
            }
        }
        return $arrayActividadesVinculadasPlan;

    }

    public function ObtenerActividadesPertDirectasPlan($parametros, $cadenaConsultaEvitar
    )
    {
        /* POR CRITERIO DE COMPOSICION */
        $idElementoPadre = $parametros->idElementoPadre;
        $cadenaConsultaEjecutar = 'SELECT distinct(e.idelemento),e.denelemento,a.fechainicio,a.fechafin,
                a.horainicio,a.horafin,e.idusuariocrea,e.gradocumplimiento,a.tiempoestimado
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a
                ON e.idelemento = a.idactividad
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementopadre AND ee.origen = 6 )
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                ON(e.idelemento = ee1.idelementohijo' .
            ((!empty($idElementoPadre)) ? " AND ee1.idelementopadre = $idElementoPadre " : '')
            . ")
                WHERE e.idelemento NOT IN ( $cadenaConsultaEvitar)";
        if ($parametros->utilizacionFT) {
            $cadenaConsultaEjecutar .= " AND e.idestadoaprob IN ("
                . $parametros->arrayEstados . ")";
        }
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function ObtenerActividadesPertMedianteARC($parametros, $cadenaConsultaEvitar
    )
    {
        /* POR CRITERIO DE COMPOSICION */
        $idElementoPadre = $parametros->idElementoPadre;
        $cadenaConsultaEjecutar = 'SELECT distinct(e.idelemento),e.denelemento,a.fechainicio,a.fechafin,
                a.horainicio,a.horafin,e.idusuariocrea,e.gradocumplimiento,a.tiempoestimado
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementopadre AND ee.origen = 6 )
                INNER JOIN mod_objetivos.dat_actividades a
                ON e.idelemento = a.idactividad
                INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apa
                ON (a.idactividad = apa.idactividad' .
            (!empty($idElementoPadre) ? " AND apa.idplan = $idElementoPadre" : '') . ")
                WHERE e.idelemento NOT IN (" . $cadenaConsultaEvitar . ")";
        if ($parametros->utilizacionFT) {
            $cadenaConsultaEjecutar .= " AND e.idestadoaprob IN ("
                . $parametros->arrayEstados . ")";
        }
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function ObtenerActividadesPertMedianteObjetivos($parametros, $cadenaConsultaEvitar
    )
    {
        /* POR CRITERIO DE COMPOSICION * */
        $idElementoPadre = $parametros->idElementoPadre;
        $cadenaConsultaEjecutar = 'SELECT distinct(e.idelemento),e.denelemento,a.fechainicio,a.fechafin,
                    a.horainicio,a.horafin,e.idusuariocrea,e.gradocumplimiento,a.tiempoestimado
                    FROM mod_objetivos.dat_elementos e
                    INNER JOIN mod_objetivos.dat_actividades a
                    ON e.idelemento = a.idactividad
                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                    ON (e.idelemento = ee.idelementopadre AND ee.origen = 6 )
                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                    ON e.idelemento = ee1.idelementohijo
                    INNER JOIN mod_objetivos.dat_elementos e4
                    ON ee1.idelementopadre = e4.idelemento
                    INNER JOIN mod_objetivos.dat_objetivo o
                    ON e4.idelemento = o.idobjetivo
                    INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo
                    ON (o.idobjetivo = apo.idobjetivo' .
            (!empty($idElementoPadre) ? " AND apo.idplan = $idElementoPadre" : '') . ")
                    WHERE e.idelemento NOT IN (" . $cadenaConsultaEvitar . ") ";
        if ($parametros->utilizacionFT) {
            $cadenaConsultaEjecutar .= " AND e.idestadoaprob IN ("
                . $parametros->arrayEstados . ")";
        }
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function ObtenerActividadesPertDependientes($parametros)
    {
        $cadenaConsultaEjecutar = "SELECT distinct(e.idelemento),e.denelemento,a.fechainicio,a.fechafin,
                a.horainicio,a.horafin,e.idusuariocrea,e.gradocumplimiento,a.tiempoestimado, ee.idelementopadre
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a
                ON e.idelemento = a.idactividad
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo AND ee.origen = 6
                AND ee.idelementopadre = " . $parametros->idActividadPadre
            . ")";
        if ($parametros->utilizacionFT) {
            $cadenaConsultaEjecutar .= " WHERE e.idestadoaprob IN ("
                . $parametros->arrayEstados . ")";
        }
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll(PDO::FETCH_ASSOC);

        if (isset($resultado[0])) $resultado = $this->obtenerPlanArrayActividades($resultado);
        return $resultado;
    }

    public function obtenerDatosActividades($parametros)
    {
        $cadenaConsultaEjecutar = 'SELECT distinct(e.idelemento),e.denelemento,a.fechainicio,a.fechafin,
                a.horainicio,a.horafin,e.idusuariocrea,e.gradocumplimiento,a.tiempoestimado,p.idplan
      FROM mod_objetivos.dat_elementos e
        INNER JOIN mod_objetivos.dat_actividades a ON e.idelemento = a.idactividad
        LEFT JOIN mod_objetivos.dat_elementos_dat_elementos ee on (ee.idelementohijo = a.idactividad AND ee.origen = 6)
        LEFT JOIN mod_objetivos.dat_plan_pdo p on (p.idplan = ee.idelementopadre) 
      WHERE e.idelemento IN (' . $parametros->strActividades . ')';
        if ($parametros->utilizacionFT) {
            $cadenaConsultaEjecutar .= ' AND e.idestadoaprob IN ('
                . $parametros->arrayEstados . ')';
        }
        $cadenaConsultaEjecutar .= " LIMIT(" . $parametros->limit . ") OFFSET("
            . $parametros->start . ") ";
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultado = $connector->execute($cadenaConsultaEjecutar)->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function ObtenerDescendenciaActividad($parametros)
    {
        $cadenaConsultaEjecutar = "SELECT distinct e.*
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo AND ee.origen = 0
                AND ee.idelementopadre = " . $parametros->idelemento . " )";
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function ObtenerRepeticionesExportarActividad($parametros)
    {
        $cadenaConsultaEjecutar = "SELECT distinct e.*
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo AND ee.origen = 4
                AND ee.idelementopadre = " . $parametros->idelemento . " )";
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function obtenerReporteDeActividadesPeriodo($datos)
    {
        $anno = $datos->valueanno;
        $mes = $datos->valuemeses;
        $fechainicio = str_replace(
            '-', '/', $datos->fechainicio
        );
        $fechafin = str_replace(
            '-', '/', $datos->fechafin
        );
        $cadenaSelect = 'SELECT da.fechainicio,da.fechafin,da.horainicio,da.horafin,de.denelemento,de.idusuariocrea,de.idelemento,de.estadocumplimiento,de.fechacreacion';
        $cadenaFromInner = ' FROM mod_objetivos.dat_elementos de INNER JOIN mod_objetivos.dat_actividades da ON (de.idelemento = da.idactividad)';
        if ($anno != '' && $mes != '') {
            $cadenaWhere = " where (SELECT date_part('year', da.fechainicio)) = $anno
                    and (SELECT date_part('month', da.fechainicio)) = $mes";
        } else {
            $cadenaWhere = " where (da.fechainicio >= '$fechainicio' and da.fechafin <= '$fechafin')";
        }
        $consulta = $cadenaSelect . $cadenaFromInner . $cadenaWhere;
        $connector = Doctrine_Manager:: connection();
        $resultado = $connector->execute($consulta);
        $resultado = $resultado->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function obtenerCantActividadesDirectasPlan($idplan)
    {
        $cadenaConsulta = "SELECT distinct count(e.idelemento) as cantactividades
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_objetivos.dat_actividades a
              ON a.idactividad = e.idelemento
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
              ON (e.idelemento = ee.idelementohijo AND ee.idelementopadre  = '$idplan')";
        $connector = Doctrine_Manager:: connection();
        $resultado = $connector->execute($cadenaConsulta);
        $resultado = $resultado->fetchAll(PDO::FETCH_COLUMN, 0);
        return $resultado;
    }

    public function obtenerIncidenciasActividades($arrayElementos)
    {
        $cadenaSelect = "SELECT DISTINCT de.idelemento,
                inc.denelemento as incidencia,
                coalesce( dob.cuerpo,'') as cuerpoobservacion /*,
                de.denelemento as actividad,
                de.estadocumplimiento as estadocumplimientoactividad,
                de.fechacreacion as fechacreacionactividad,
                desv.idelemento as idelementodesv,
                desv.denelemento AS desviacion,
                desv.descelemento,
                coalesce( dob.asunto,'') as asuntoobservacion,
                inc.idelemento as idincidencia,
                inc.descelemento as descelementoincidencia*/";
        $cadenaFromInner = " FROM mod_objetivos.dat_elementos de
                INNER JOIN mod_objetivos.dat_actividades da ON (de.idelemento = da.idactividad) AND (de.idtipoelemento = 3)
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (de.idelemento = ee.idelementohijo)
                INNER JOIN mod_objetivos.dat_elementos desv ON (ee.idelementopadre = desv.idelemento) AND (desv.idtipoelemento = 6)
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeinc ON (desv.idelemento = eeinc.idelementopadre)
                INNER JOIN mod_objetivos.dat_elementos inc ON (inc.idelemento = eeinc.idelementohijo) AND (inc.idtipoelemento = 5)
                LEFT JOIN mod_objetivos.dat_observaciones_pdo dob ON (dob.idelemento = de.idelemento)";
        $cadenaWhere = " where de.idelemento in ($arrayElementos)";
        $consulta = $cadenaSelect . $cadenaFromInner . $cadenaWhere;
        $connector = Doctrine_Manager:: connection();
        $resultado = $connector->execute($consulta);
        $resultado = $resultado->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function getIdUsuario($parametros)
    {
        $cadena = "   SELECT
                      su.idusuario
                    FROM
                      mod_seguridad.seg_usuario su
                    WHERE
                      su.nombreusuario = '$parametros->usuario' ";


        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['idusuario'];
    }

    public function objetivosFirma($param)
    {

        $conn = Doctrine_Manager:: connection();
        $condicion = " WHERE (e.idusuariocrea = {$param->idusuariosession} 
                            OR i.idusuario = {$param->idusuariosession}) ";
        if ($param->fechainicio != '' && $param->fechafin != '') {
            $condicion .= " AND ( (o.fechainicio <= '$param->fechainicio' AND o.fechafin >= '$param->fechainicio')  
                OR (o.fechainicio <= '$param->fechafin'                        AND o.fechafin >= '$param->fechafin')                   
                OR (o.fechainicio >= '$param->fechainicio'                         AND o.fechafin <= '$param->fechafin')) ";

        } else if ($param->valuemeses != '' && $param->valueanno != '') {
            $condicion .= "AND (SELECT date_part('year', o.fechainicio)) = $param->valueanno
                    AND (SELECT date_part('month', o.fechainicio)) = $param->valuemeses ";

        }

        $whereplan = "";
        if ($param->idplan != '' && $param->str_idelementos != "") {
            $whereplan = " AND o.idobjetivo in (" . $param->str_idelementos . ")";
        }

        $query = "SELECT 
                    distinct e.denelemento as objetivo 
                    FROM mod_objetivos.dat_elementos e                
                    INNER JOIN mod_objetivos.dat_objetivo o                 ON o.idobjetivo = e.idelemento                                                                   
                    LEFT JOIN mod_flujotrabajo.dat_estado es                ON e.idestadoaprob = es.idestado       
                    
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                    ON (ei.idelemento = e.idelemento) 
                
                    LEFT JOIN mod_objetivos.dat_involucrados i 
                    ON (ei.idinvolucrado = i.idinvolucrado)
                            
                    $condicion $whereplan
                      AND e.idestadoaprob IN ($param->idestados)";

//        print_r($query);die();
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function objetivosActs($params)
    {
        $conn = Doctrine_Manager:: connection();
        $condicion1 = "WHERE ";
        $condicion2 = "WHERE ";
        if ($params->fechainicio != '' && $params->fechafin != '') {
            $condicion1 .= "( (o.fechainicio <= '$params->fechainicio' AND o.fechafin >= '$params->fechainicio')  
                OR (o.fechainicio <= '$params->fechafin'                        AND o.fechafin >= '$params->fechafin')                   
                OR (o.fechainicio >= '$params->fechainicio'                         AND o.fechafin <= '$params->fechafin'))"
                . "AND   ( (a.fechainicio <= '$params->fechainicio' AND a.fechafin >= '$params->fechainicio')  
                OR (a.fechainicio <= '$params->fechafin'                        AND a.fechafin >= '$params->fechafin')                   
                OR (a.fechainicio >= '$params->fechainicio'                         AND a.fechafin <= '$params->fechafin'))  AND";
            $condicion2 .= "( (a.fechainicio <= '$params->fechainicio' AND a.fechafin >= '$params->fechainicio')  
                OR (a.fechainicio <= '$params->fechafin'                        AND a.fechafin >= '$params->fechafin')                   
                OR (a.fechainicio >= '$params->fechainicio'                         AND a.fechafin <= '$params->fechafin'))  AND";

        } else if ($params->valuemeses != '' && $params->valueanno != '') {
            $condicion1 .= "(SELECT date_part('year', o.fechainicio)) = $params->valueanno
                    and (SELECT date_part('month', o.fechainicio)) = $params->valuemeses"
                . "and (SELECT date_part('year',a.fechainicio)) = $params->valuemeses"
                . "and (SELECT date_part('month', a.fechainicio)) = $params->valuemeses  AND";
            $condicion2 .= "(SELECT date_part('year', a.fechainicio)) = $params->valueanno
                    and (SELECT date_part('month', a.fechainicio)) = $params->valuemeses  AND";

        }
        $query = "SELECT 
            distinct 
            e.denelemento, e.denelemento as actividades , 0 as orden ,
            o.fechafin - o.fechainicio as plazo,
            '' AS dirigentes,
            '' AS participantes
            FROM mod_objetivos.dat_elementos e                
            INNER JOIN mod_objetivos.dat_objetivo o                 ON o.idobjetivo = e.idelemento   
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementopadre ) 
            INNER JOIN mod_objetivos.dat_actividades a ON (a.idactividad = ee.idelementohijo)                                                                  
            LEFT JOIN mod_flujotrabajo.dat_estado es                ON e.idestadoaprob = es.idestado               
            $condicion1
            e.idestadoaprob IN ($params->idestados)
                
             union 

            SELECT distinct

            ef.denelemento,  
            e.denelemento as objetivo,    
            1 as orden ,
            a.fechafin - a.fechainicio as plazo,
            e.dirigente AS dirigentes,
            e.participante AS participantes
            FROM mod_objetivos.dat_elementos e                
            INNER JOIN mod_objetivos.dat_actividades a ON (a.idactividad = e.idelemento)     
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementohijo ) 
            INNER JOIN mod_objetivos.dat_elementos ef         on (ef.idelemento = ee.idelementopadre)        
            INNER JOIN mod_objetivos.dat_objetivo o                 ON (o.idobjetivo = ef.idelemento)     
            $condicion1
            e.idestadoaprob IN ($params->idestados)

            order by denelemento,orden,actividades";

        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        //print_r($result);die();
        return $result;
    }

    public function objetivosCriteriosMedida($params)
    {
        $conn = Doctrine_Manager:: connection();
        $condicion1 = "WHERE ";
        $condicion2 = "WHERE ";
        if ($params->fechainicio != '' && $params->fechafin != '') {
            $condicion1 .= "( (o.fechainicio <= '$params->fechainicio' AND o.fechafin >= '$params->fechainicio')  
                OR (o.fechainicio <= '$params->fechafin'                        AND o.fechafin >= '$params->fechafin')                   
                OR (o.fechainicio >= '$params->fechainicio'                         AND o.fechafin <= '$params->fechafin')) AND";


        } else if ($params->valuemeses != '' && $params->valueanno != '') {
            $condicion1 .= "(SELECT date_part('year', o.fechainicio)) = $params->valueanno
                    and (SELECT date_part('month', o.fechainicio)) = $params->valuemeses  AND";

        }
        $query = "SELECT e.denelemento, e.denelemento as objetivo , 0 as orden 
            FROM mod_objetivos.dat_elementos e                
            INNER JOIN mod_objetivos.dat_objetivo o                 ON o.idobjetivo = e.idelemento   
            INNER JOIN mod_objetivos.dat_criteriomedida cm                 ON o.idobjetivo = cm.idobjetivo                                                                     
            LEFT JOIN mod_flujotrabajo.dat_estado es                ON e.idestadoaprob = es.idestado               
            $condicion1
            e.idestadoaprob IN ($params->idestados)

            union 
               
            SELECT e.denelemento,cm.dencriterio as objetivo , 1 as orden 
            FROM mod_objetivos.dat_elementos e                
            INNER JOIN mod_objetivos.dat_objetivo o                 ON o.idobjetivo = e.idelemento   
            INNER JOIN mod_objetivos.dat_criteriomedida cm                 ON o.idobjetivo = cm.idobjetivo                                                                     
            LEFT JOIN mod_flujotrabajo.dat_estado es                ON e.idestadoaprob = es.idestado 
            $condicion1
            e.idestadoaprob IN ($params->idestados)
                
            order by denelemento,orden,objetivo";
        //print_r($query);die();
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    //******Integracion con Proyecto*****
    public function getElementDadoTipo($id, $tipo)
    {
        $cadena
            = "SELECT *
        FROM mod_objetivos.dat_elementos e
        WHERE e.idelemento = {$id}
        AND e.idtipoelemento = {$tipo} ";
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadena);
        $resultado = $resultadoParcial->fetchAll();
        return $resultado;
    }

  //******Integracion con Proyecto*****
  public function getDenominacionEstadoAprob($id)
  {
    $cadena
              = "SELECT       
                   es.denominacion  AS nombreestadoaprob
                            FROM 
                              mod_objetivos.dat_elementos e
                              INNER JOIN mod_flujotrabajo.dat_estado es
                              ON e.idestadoaprob = es.idestado 
                              where e.idelemento={$id} ";
    $connector = Doctrine_Manager:: connection();
    $resultadoParcial = $connector->execute($cadena);
    $resultado = $resultadoParcial->fetchAll();
    return $resultado[0]['nombreestadoaprob'];
  }

    public function ObtenerHitosDadoProyecto($idproyecto)
    {
        $query = new Doctrine_Query();
        $result = $query->select('e.*')
            ->from('DatElementos e')
            ->innerJoin('e.DatElementosDatElementos ee')
            ->where('ee.idelementopadre = ?', $idproyecto)
            ->addWhere('ee.origen = ?', 1)
            ->addWhere('e.idtipoelemento = ?', 9)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function ObtenerTareasPertDadoHitos($parametros)
    {

        $cadenaConsultaEvitar
            = "SELECT e3.idelemento FROM mod_objetivos.dat_elementos e3
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                  ON (e3.idelemento = ee2.idelementohijo AND ee2.origen = 6)";

        $cadenaConsultaEjecutar
            = "SELECT distinct(e.idelemento),e.denelemento,e.idusuariocrea,t.*, h.idhito,
                          t.duracionestimada as tiempoestimado, e.gradocumplimiento, e.descelemento as descelemento
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_planifproyecto.dat_tarea t
              ON e.idelemento = t.idtarea 
              /*INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
              ON (e.idelemento = ee.idelementopadre AND ee.origen = 6 )*/  -- Resolucion de Nc que no muestra las actividades del hito sin relacionar
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
              ON e.idelemento = ee1.idelementohijo
              
              INNER JOIN mod_objetivos.dat_elementos e4
              ON ee1.idelementopadre = e4.idelemento
              INNER JOIN mod_planifproyecto.dat_hito h
              ON e4.idelemento = h.idhito";
        if ($parametros->arrayhitos) {
            $arrayhitos = implode(',', $parametros->arrayhitos);

            $cadenaConsultaEjecutar .= " WHERE h.idhito IN ("
                . $arrayhitos . ")  and e.idelemento NOT IN ("
                . $cadenaConsultaEvitar . ") ";
        }
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll();
        return $resultado;
    }

    public function tareaEsPlantilla($idTarea)
    {
        $cadena
            = "SELECT t.plantilla
                FROM mod_planifproyecto.dat_tarea t
                WHERE t.idtarea = {$idTarea}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function hitoEsPlantilla($idhito)
    {
        $cadena
            = "SELECT h.plantilla
                FROM mod_planifproyecto.dat_hito h
                WHERE h.idhito = {$idhito}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function ObtenerTareasReporteMatrizAntecedentes($parametros)
    {

        $cadenaConsultaEjecutar
            = "SELECT distinct(e.idelemento),e.denelemento,e.idusuariocrea,t.*,
                          t.duracionestimada as tiempoestimado
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_planifproyecto.dat_tarea t
              ON e.idelemento = t.idtarea 
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
              ON e.idelemento = ee1.idelementohijo
              
              INNER JOIN mod_objetivos.dat_elementos e4
              ON ee1.idelementopadre = e4.idelemento
              INNER JOIN mod_planifproyecto.dat_hito h
              ON e4.idelemento = h.idhito";
        if ($parametros->arrayhitos) {
            $arrayhitos = implode(',', $parametros->arrayhitos);

            $cadenaConsultaEjecutar .= " WHERE h.idhito IN ("
                . $arrayhitos . ")";
        }
        $cadenaConsultaEjecutar .= " ORDER BY t.fechainicio, t.horainicio";
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll();
        return $resultado;
    }

    public function ObtenerTareasParaGestionarEjecucion($parametros)
    {

        $cadenaConsultaEjecutar
            = "SELECT distinct(e.idelemento),e.denelemento,e.idusuariocrea,t.*,
                          t.duracionestimada as tiempoestimado, e.gradocumplimiento
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_planifproyecto.dat_tarea t
              ON e.idelemento = t.idtarea 
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
              ON e.idelemento = ee1.idelementohijo
              
              INNER JOIN mod_objetivos.dat_elementos e4
              ON ee1.idelementopadre = e4.idelemento
              INNER JOIN mod_planifproyecto.dat_hito h
              ON e4.idelemento = h.idhito";
        if ($parametros->arrayhitos) {
            $arrayhitos = implode(',', $parametros->arrayhitos);

            $cadenaConsultaEjecutar .= " WHERE h.idhito IN ("
                . $arrayhitos . ")  AND e.gradocumplimiento NOT IN (" . 100
                . ")";
        }
        $cadenaConsultaEjecutar .= " ORDER BY t.fechainicio, t.horainicio";
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll();
        return $resultado;
    }

    public function ObtenerTareasDadoProyectoOPlantilla($parametros)
    {

        $cadenaConsultaEjecutar
            = "SELECT distinct(e.idelemento),e.denelemento,e.idusuariocrea,t.*,
                          t.duracionestimada as tiempoestimado
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_planifproyecto.dat_tarea t
              ON (e.idelemento = t.idtarea AND t.plantilla = 1)
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
              ON e.idelemento = ee1.idelementohijo
              
              INNER JOIN mod_objetivos.dat_elementos e4
              ON ee1.idelementopadre = e4.idelemento
              INNER JOIN mod_planifproyecto.dat_hito h
              ON e4.idelemento = h.idhito";
        if ($parametros->arrayhitos) {
            $arrayhitos = implode(',', $parametros->arrayhitos);

            $cadenaConsultaEjecutar .= " WHERE h.idhito IN ("
                . $arrayhitos . ")";
        }
        $cadenaConsultaEjecutar .= " ORDER BY t.fechainicio, t.horainicio";
        //print_r($cadenaConsultaEjecutar);die;

        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll();
        return $resultado;
    }

    public function ObtenerCantTareasEjecutadasEnParalelo($parametros)
    {

        $cadenaConsultaEjecutar
            = "SELECT sum (s.contador) as tareasparalelas from
                 (SELECT count(e.idelemento) as contador
              FROM mod_objetivos.dat_elementos e
              INNER JOIN mod_planifproyecto.dat_tarea t
              ON e.idelemento = t.idtarea 
              INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
              ON e.idelemento = ee1.idelementohijo
              
              INNER JOIN mod_objetivos.dat_elementos e4
              ON ee1.idelementopadre = e4.idelemento
              INNER JOIN mod_planifproyecto.dat_hito h
              ON e4.idelemento = h.idhito";
        if ($parametros->arrayhitos) {
            $arrayhitos = implode(',', $parametros->arrayhitos);

            $cadenaConsultaEjecutar .= " WHERE h.idhito IN ("
                . $arrayhitos . ")";
        }
        $cadenaConsultaEjecutar
            .= " GROUP BY
                                        t.fechainicio, t.horainicio 
                                     HAVING 
                                        count(e.idelemento) > 1 ) s ";
        //print_r($cadenaConsultaEjecutar);die;
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll();
        return $resultado;
    }

    public function tieneHijos($parametros)
    {
        $cadenaSelect
            = " SELECT e.idelemento
                FROM  mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo
                AND ee.idelementopadre = {$parametros->idelementopadre}
                AND ee.origen IN (0,1,2,3))";
        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count(
            $connA->execute($cadenaSelect)->fetchAll()
        );
        $result = $connA->execute($cadenaSelect)->fetchAll();
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function ObtenerHitosDadoElemento($parametros)
    {
        $cadenaSelect
            = "  SELECT e.idelemento, e.idtipoelemento, e.denelemento, h.fechainicio
                FROM  mod_objetivos.dat_elementos e
                  LEFT JOIN  mod_planifproyecto.dat_hito h
                    ON(e.idelemento = h.idhito)
                   INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                     ON (e.idelemento = ee.idelementohijo)
                      WHERE
                        ee.idelementopadre = {$parametros->idproyecto} AND ee.origen = 1 AND e.idtipoelemento = 9
                          ORDER BY h.fechainicio, h.fechafin ";
        $conn = Doctrine_Manager:: connection();
        $resultado = $conn->execute($cadenaSelect)->fetchAll();
        return $resultado;
    }

    public function obtenerTareasParaChequear($parametros)
    {
        $cadenaSelect
            = "  SELECT e.idelemento, e.idtipoelemento, e.denelemento,
                e.idusuariocrea, e.activo, e.fechacreacion,
                e.gradocumplimiento, e.estadocumplimiento,
                es.denominacion AS denoestado, e.idestadoaprob,
                t.plantilla, t.duracionreal, t.duracionestimada,
                t.fechafin, t.fechainicio, t.horainicio, t.horafin  

            FROM  mod_objetivos.dat_elementos e
            
              LEFT JOIN  mod_flujotrabajo.dat_estado es
                ON(e.idestadoaprob = es.idestado)  
                
                  LEFT JOIN  mod_planifproyecto.dat_tarea t
                    ON(e.idelemento = t.idtarea)

                      WHERE (e.idusuariocrea = {$parametros->idusuariosession}
                         OR e.idelemento IN (SELECT ei.idelemento
                                                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                                                  LEFT JOIN mod_objetivos.dat_involucrados i
                                                     ON (ei.idinvolucrado = i.idinvolucrado)
                                                       WHERE i.idusuario = {$parametros->idusuariosession} ))  
                                                           ORDER BY
                                                             t.fechainicio, t.horainicio, t.fechafin ";

        $conn = Doctrine_Manager:: connection();
        $resultado = $conn->execute($cadenaSelect)->fetchAll();
        return $resultado;
    }

    public function ObtenerTareasPertDirectasProyecto($parametros)
    {

        $cadenaConsultaEvitar
            = "SELECT e3.idelemento FROM mod_objetivos.dat_elementos e3
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                  ON (e3.idelemento = ee2.idelementohijo AND ee2.origen = 6)";

        $cadenaConsultaEjecutar
            = "SELECT distinct(e.idelemento),e.denelemento, e.idusuariocrea,t.* , /*h.idhito, e4.denelemento as denhito,*/
                        t.duracionestimada as tiempoestimado, t.tiempooptimista as tiempooptimista, t.tiempomedio as tiempomedio, t.tiempopesimista as tiempopesimista,
                        /*ee.idelementopadre as antecedente,*/ e.gradocumplimiento, e.descelemento as descelemento
                      FROM mod_objetivos.dat_elementos e
                          INNER JOIN mod_planifproyecto.dat_tarea t
                             ON e.idelemento = t.idtarea
                            /*INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                                   ON (e.idelemento = ee.idelementopadre AND ee.origen = 6 )*/
                                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                     ON(e.idelemento = ee1.idelementohijo AND ee1.idelementopadre = " . $parametros->elemento->idelemento . ")";

        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadenaConsultaEjecutar);
        $resultado = $resultadoParcial->fetchAll();
        return $resultado;
    }
    //******Fin Integracion con Proyecto*****

}

//fin clase 

