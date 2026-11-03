<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class FilaModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomFilaestruc();
    }

    /**
     * Descripción del método: Inserta un valor nuevo
     *
     * @param int $pidTabla
     * @param bool $idpadre
     *
     * @return bool
     * @author    : Ing. Javier Limonta Neyra
     * @modify    :Ing. Daymel Machado Cabrera
     *
     * @copyright Copyright (c) 2013 xetid
     */

    public function insertar($pidTabla, $idpadre = false, $orden = false)
    {

        $doctrineObject = Doctrine_Manager::getInstance();
        $connection = $doctrineObject->getCurrentConnection();
        $this->Instancia();
        $this->instance->idconcepto = $pidTabla;
        $object = new NomFilaestruc();
        if (is_numeric($idpadre)) {
            $this->instance->idpadre = $idpadre;
            $this->instance->nivel = $object->dameNivel($idpadre);
            $this->instance->orden = ($orden) ? $orden : $object->dameOrden($idpadre);
        } else {
            $idpadre = $connection->fetchAll("SELECT last_value from mod_estructuracomp.sec_filaestruc_seq;")[0]['last_value'];
            $orden = $connection->fetchAll("SELECT count(idfila) from mod_estructuracomp.nom_filaestruc WHERE idfila=idpadre")[0]['count'];
            $this->instance->idpadre = $idpadre;
            $this->instance->nivel = 1;
            $this->instance->orden = $orden + 1;
        }

        $this->instance->save();

        $idFila = $this->instance->idfila;

        $connection->commit();
        $connection->beginTransaction();
        $iddominio = $this->global->Perfil->iddominio;
        $connection->fetchAll(
            "UPDATE mod_estructuracomp.nom_filaestruc
                  SET dominiofila = crear_dominiofila($iddominio, dominiofila)
                  WHERE idfila = $idFila");

        return $idFila;
    }

    /**
     * Descripción del método: ELimina los valores de la fila
     *
     * @param int $idFila
     * @param     $idProyecto
     *
     * @return bool
     * @author    : Ing. Javier Limonta Neyra
     *
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminarFila($idFila, $idProyecto, $idnomcargo, $idusuario)
    {
        //try{
            $estructuraV = new EstructuraIntegracionValidator();
            if ($idProyecto == 0) {
                if ($estructuraV->validarEliminar($idFila)) {
                    $this->conn->fetchAll("Select mod_estructuracomp.f_eliminar_tree_fechafin($idFila)");
                }else{
                    $this->conn->fetchAll("Select mod_estructuracomp.f_eliminar_tree('nom_filaestruc','idfila',$idFila)");
                }

            } else {
                $this->conn->fetchAll("Select mod_estructuracomp.f_eliminar_por_proyecto($idFila, $idProyecto)");

                $sql = "UPDATE mod_estructuracomp.dat_proyecto 
                    SET 
                    modificado = 1
                    WHERE idproyecto = $idProyecto;";
                $query = Doctrine_Query::create();
                $conn = $query->getConnection();
                $conn->execute($sql);
            }
        /*}catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                return false;
            }else{
                return true;
            }

        }*/


        return true;
    }

    /**
     * Descripción del método: Devuelve el proximo id de la tabla
     *
     * @return int
     * @author    : Ing. Javier Limonta Neyra
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscaridproximo()
    {
        $query = Doctrine_Query::create();
        // eliminar el campo
        $result = $query->select('max(a.idfila) as maximo')->from('NomFilaestruc a')->execute()->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

        return $proximo;
    }

    /**
     * @param $idpadre
     *
     * @return int
     */
    public function buscaridproximoOrden($idpadre)
    {
        $query = Doctrine_Query::create();
        // eliminar el campo
        $result = $query->select('max(a.orden) as maximo')->from('NomFilaestruc a')->where(
            'a.idpadre = ?', $idpadre
        )->execute()->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

        return $proximo;
    }

    /**
     * @return int
     */
    public function buscarproximodominio()
    {
        $query = Doctrine_Query::create();
        // eliminar el campo
        $result = $query->select('max(a.dominio) as maximo')->from('NomFilaestruc a')->execute()->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

        return $proximo;
    }

    /**
     * Descripción del método: Borrar la instancia vieja que poseia el modelo
     *
     * @author    : Ing. Javier Limonta Neyra
     * @copyright Copyright (c) 2013 xetid
     */
    public function Instancia()
    {
        $this->instance = null;
        $this->instance = new NomFilaestruc();
    }

    /**
     * @param $idFila
     *
     * @return array|bool
     */
    public function buscarFilaEstructura($idFila)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomFilaestruc')->where("idfila = '$idFila'")->execute();

            return $result->toArray();
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__FILE__ . ' ' . __LINE__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    /**
     * @param $identificador
     * @param $ordenNuevo
     *
     * @return array
     */
    public function desplazarOrden($identificador, $ordenNuevo)
    {
        $connection = Doctrine_Manager::getInstance()->getCurrentConnection();
        $ordenNuevo = (is_numeric($ordenNuevo)) ? $ordenNuevo : 0;

        $result = $connection->fetchAll("SELECT mod_estructuracomp.f_cambiar_orden($identificador, $ordenNuevo)");

        return $result;
    }

    public function desplazarOrdenProyecto($identificador, $ordenNuevo, $idproyecto)
    {
        $connection = Doctrine_Manager::getInstance()->getCurrentConnection();
        $ordenNuevo = (is_numeric($ordenNuevo)) ? $ordenNuevo : 999999;


        $datosFila = $connection->fetchAll("SELECT f.idfila,ep.idelementoproyecto,
        CASE WHEN ep.orden is null THEN f.orden ELSE ep.orden END as orden,
        CASE WHEN ep.ordenunico is null THEN f.ordenunico ELSE ep.ordenunico END as ordenunico
        FROM mod_estructuracomp.nom_filaestruc f
        LEFT JOIN mod_estructuracomp.dat_elementoproyecto ep ON(ep.idfila=f.idfila AND ep.idproyecto=$idproyecto)
        WHERE f.idpadre = (SELECT idpadre  FROM mod_estructuracomp.nom_filaestruc WHERE idfila = $identificador)
        ORDER BY orden;");

        $nuevoOrdenAponer = $ordenNuevo;
        // print_r($nuevoOrdenAponer);die;
        foreach ($datosFila as $datoFila) {
            $idfila = $datoFila['idfila'];
            $idproyecto = $idproyecto;
            $idelementoproyecto = $datoFila['idelementoproyecto'];
            $orden = $datoFila['orden'];



            if ($orden >= $nuevoOrdenAponer&&$idfila != $identificador) {
                $nuevoOrdenAponer++;
                if ($idelementoproyecto) {
                    $update = $connection->fetchAll("UPDATE  mod_estructuracomp.dat_elementoproyecto 
                SET idfila = $idfila, idproyecto = $idproyecto,  orden =$nuevoOrdenAponer , ordenunico = 'a'
                WHERE idelementoproyecto = $idelementoproyecto;");

                } else {
                    $connection->fetchAll("INSERT INTO 
              mod_estructuracomp.dat_elementoproyecto (idfila,idproyecto, orden,ordenunico) VALUES ($idfila,$idproyecto, $nuevoOrdenAponer ,'i');");

                }


            }
            if ($idfila == $identificador) {
                if ($idelementoproyecto) {
                    $update = $connection->fetchAll("UPDATE  mod_estructuracomp.dat_elementoproyecto 
                SET idfila = $idfila, idproyecto = $idproyecto,  orden =$ordenNuevo , ordenunico = 'a'
                WHERE idelementoproyecto = $idelementoproyecto;");

                } else {

                    $connection->fetchAll("INSERT INTO 
              mod_estructuracomp.dat_elementoproyecto (idfila,idproyecto, orden,ordenunico) VALUES ($idfila,$idproyecto, $ordenNuevo ,'i');");

                }
            }


        }


        return 1;
    }

    /**
     * @param $identificador
     * @param $idpadreviejo
     * @param $idpadrenuevo
     *
     * @return array
     */
    public function moverArbol($identificador, $idpadreoriginal, $idpadrenuevo, $idproyecto)
    {
        $connection = Doctrine_Manager::getInstance()->getCurrentConnection();

        $result = $connection->fetchAll("SELECT mod_estructuracomp.f_mover_arbol($identificador,$idpadreoriginal, $idpadrenuevo,$idproyecto)");

        return $result;
    }

    /**
     * @param $identificador
     * @param $newPadre
     *
     * @return bool
     */
    public function cambiarPadre($identificador, $newPadre)
    {
        $objectRow = Doctrine::getTable('NomFilaestruc')->find($identificador);
        if (is_numeric($newPadre)) {
            $objectRow->idpadre = $newPadre;
            $objectRow->save();
        }

        return true;
    }

    /**
     * @param $identificador
     * @param $idConcepto
     * @param $idproyecto
     *
     * @return array|bool
     */
    public function dameResumenPorEstructura($identificador, $idConcepto, $idproyecto)
    {
        $objectRow = Doctrine::getTable('NomFilaestruc')->find($identificador);
        $parent_path = $objectRow->parent_path;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create();
        $result = $query->select('fila.idfila as identificador')
            ->from('NomFilaestruc fila')
            ->where("fila.parent_path operator (public.<@) '$parent_path' AND fila.fechafin is NULL")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        if (count($result) > 0) {
            $valores = '';
            foreach ($result as $index => $value) {
                if ($index < count($result) - 1) {
                    $valores .= $value['identificador'] . ',';
                } else {
                    $valores .= $value['identificador'];
                }
            }
            $sqlWhere = "fila.idconcepto = $idConcepto AND fila.idfila IN ($valores)";
            $iddominio = $this->global->Perfil->iddominio;
            $sqlFiltroProyectoCargoMilitar = "";
            $sqlFiltroProyectoCargoCivil = "";
            if ($this->verificaIdProyecto($idproyecto)) { // tratamiento del proyecto
                $sqlFiltroProyectoEstructura
                    = " AND ((estructura.idestado = 0 and estructura.modificado[$idproyecto] = 0) " .
                    "OR ( estructura.idproyecto = $idproyecto))";
                $sqlFiltroProyectoEstructuraOP
                    = " AND ((estructuraop.idestado = 0 and estructuraop.modificado[$idproyecto] = 0) " .
                    "OR ( estructuraop.idproyecto = $idproyecto))";
                $sqlFiltroProyectoCargo
                    = " AND ((cargo.idestado = 0 and cargo.modificado[$idproyecto] = 0) " .
                    "OR ( cargo.idproyecto = $idproyecto AND cargo.idestado<>3))";
                $sqlFiltroProyectoCargoCivil = " AND cargo.idproyecto = cargociv.idproyecto";
                $sqlFiltroProyectoCargoMilitar = " AND cargo.idproyecto = cargom.idproyecto";
                $sqlFiltroMedio
                    = " AND ((medio.idestado = 0 and medio.modificado[$idproyecto] = 0) " .
                    "OR ( medio.idproyecto = $idproyecto AND medio.idestado<>3))";
            } else {
                $sqlFiltroProyectoEstructura = " AND (estructura.idestado = 0 ) ";
                $sqlFiltroProyectoEstructuraOP = " AND (estructuraop.idestado = 0 ) ";
                $sqlFiltroProyectoCargo = " AND (cargo.idestado = 0 ) ";
                $sqlFiltroMedio = " AND (medio.idestado = 0 ) ";
            }
            $esquema = "mod_estructuracomp";
            $sql = "
        SELECT fila.idfila as id, fila.idconcepto ,
        (CASE
            when nomcvil.denominacion <> '' then nomcvil.denominacion
            when estructura.denominacion <> '' then estructura.denominacion
            when estructuraop.denominacion <> '' then estructuraop.denominacion
            when nommedio.denominacion <> '' then nommedio.denominacion
        END) as text,
        (CASE
            when cargociv.idcategocup IS NOT NULL then TRUE ELSE FALSE
        END) as civil,
        (CASE
            when nomcvil.denominacion <> '' then cargo.cantidad
            when nommedio.denominacion <> '' then medio.cantidad
        END) as cantidad,
        (CASE
            when nommedio.denominacion <> '' then nomtipomedio.denominacion
        END) as tipomedio

        FROM $esquema.nom_filaestruc fila
        LEFT JOIN $esquema.dat_estructura estructura
            ON (estructura.idestructura = fila.idfila $sqlFiltroProyectoEstructura)
        LEFT JOIN $esquema.dat_estructuraop estructuraop
            ON (estructuraop.idestructuraop = fila.idfila $sqlFiltroProyectoEstructuraOP)
        LEFT JOIN $esquema.dat_cargo cargo
            ON (cargo.idcargo = fila.idfila $sqlFiltroProyectoCargo)
        LEFT JOIN $esquema.dat_cargocivil cargociv
            ON (cargociv.idcargo = cargo.idcargo
            AND cargociv.idproyecto = cargo.idproyecto $sqlFiltroProyectoCargoCivil)
        LEFT JOIN $esquema.dat_cargomilitar cargom
            ON (cargom.idcargo = cargo.idcargo AND cargom.idproyecto = cargo.idproyecto $sqlFiltroProyectoCargoMilitar)
        LEFT JOIN $esquema.nom_cargo nomcvil
            ON (nomcvil.idnomcargo = cargo.idnomcargo)
        LEFT JOIN $esquema.dat_medio medio
            ON (medio.idmedio = fila.idfila $sqlFiltroMedio)
        LEFT JOIN $esquema.nom_tipomedio nomtipomedio
            ON (nomtipomedio.idtipomedio = medio.idtipomedio)
        LEFT JOIN mod_datosmaestros.nom_indicador nommedio
            ON (nommedio.idindicador = medio.idnommedio)
        WHERE fila.fechafin IS NULL AND (estructura.denominacion <> '' OR estructuraop.denominacion <> ''
              OR nomcvil.denominacion <> '' OR nommedio.denominacion <> '')
              AND fila.dominiofila [$iddominio] = 1 :: bit
              AND $sqlWhere
              ORDER BY (fila.orden)";
            $arregloPermiso = $conn->fetchAll($sql);
            $resultado = array();
            foreach ($arregloPermiso as $value) {
                $pos = $this->buscarValor($resultado, $value);
                if (is_numeric($pos)) {
                    $resultado[$pos]['cantidad'] += $value['cantidad'];
                } else {
                    $resultado[] = $value;
                }
            }

            return $resultado;
        } else {
            return false;
        }
    }

    /**
     * @param $elementos
     * @param $valor
     *
     * @return bool|int|string
     */
    private function buscarValor($elementos, $valor)
    {
        foreach ($elementos as $index => $value) {
            if ($value['text'] == $valor['text'] && $value['civil'] == $valor['civil']) {
                return $index;
            }
        }

        return false;
    }

    /**
     * @param $idEstructura
     *
     * @return Doctrine_Collection
     */
    public static function damePadreEstructura($idEstructura)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('idpadre as identificador')->from('NomFilaestruc')->where(
            "idfila = ?", $idEstructura
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Obtener el tipo de concepto de una estructura
     *
     * @param $idEstructura
     *
     * @return mixed
     * @author  : Ing. Daymel Machado
     */
    public static function obtenerTipoEstructura($idEstructura)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('idconcepto as tipo')->from('NomFilaestruc')->where("idfila = ?", $idEstructura)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * @param $idproyecto
     *
     * @return bool
     */
    public function verificaIdProyecto($idproyecto)
    {
        return $idproyecto != 0 && is_numeric($idproyecto);
    }
}

