<?php

/**
 * Clase de negocio para implementar el negocio de configsecodena.
 * @copyright XETID
 * @package Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @author Liv\xE1n Capote Valdés
 * @version 1.0-0
 */

class GestnivelestructuralModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Función que se utiliza para insertar un objeto en la BD
     *
     * @param object $objeto -Un objeto del tipo de la clase
     *
     * @return bool
     */
    function insertar($objeto)
    {
        $objeto->save();
        return true;
    }

    /**
     * Función que se utiliza para modificar un objeto en la BD
     *
     * @param object $objeto -Un objeto del tipo de la clase
     *
     * @return bool
     */
    function modificar($objeto)
    {
        $objeto->save();
        return true;
    }

    /**
     * Función que se utiliza para eliminar un objeto en la BD
     *
     * @param object $objeto -Un objeto del tipo de la clase
     *
     * @return bool
     * @throws Doctrine_Exception
     */
    function eliminar($objeto)
    {
        try {
            $objeto->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
            echo $ee;
        }
    }

    /**
     * Función que se utiliza para eliminar una base legal en la BD
     *
     * @param object $obj$objeto -Un objeto del tipo de la clase
     *
     * @return bool
     * @throws Doctrine_Exception
     */
    function eliminarBaseLegal($objeto)
    {
        $hijos = NomBaselegal::cargarEstructuraplanConFechafin($objeto->idbaselegal);
        if ($hijos) {
            $query = new Doctrine_Query();
            $result = $query->update('NomBaselegal')->set('fechafin=?', 'now()')->where(
                "idbaselegal = '$objeto->idbaselegal'"
            )->execute();
            return false;
        } else {
            try {
                $objeto->delete();
                return true;
            } catch (Exception $e) {
                $this->conn->commit();
                if ($e->GetCode() == 23503) {
                    $query = new Doctrine_Query();
                    $result = $query->update('NomBaselegal')->set('fechafin=?', 'now()')->where(
                        "idbaselegal = '$objeto->idbaselegal'"
                    )->execute();
                    return false;
                }
            }
        }
    }

    /**
     * Buscar todas la cantidad de aristas
     *
     * @param int $idTabla
     *
     * @return array
     */
    function cantidadConexiones($idTabla)
    {
        $q = new Doctrine_Query();
        $result = $q->select("h.*")
            ->from('NomnivelestructuralNomnivelestructural h')
            ->where("h.idorigen='$idTabla' ")
            ->count();
        return $result;
    }

    /**
     * Buscar todas las aristas de la tabla enviada
     * si se envia falso entonces buscar las que son raices
     *
     * @param int   $idTabla
     * @param int   $start Comienzo inferior
     * @param int   $limit Límite superior
     * @param mixed $todas
     *
     * @return array
     */
    function buscarConexiones($idTabla, $start, $limit, $todas)
    {
        $sqlTipo = '';
        $q = Doctrine_Query::create();
        if (!$idTabla) { //Para devolver todas las raices
            $sqlTipo = "y.raiz='1' " . $sqlTipo;
            $result = $q->select("y.idnivelestructural as id, c.denominacion as text, y.*,c.*")
                ->from('NomNivelestructural y')
                ->innerJoin('y.NomConceptonivel c')
                ->where($sqlTipo)->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

            return $result;
        }
        if ($todas) {
            $sqlTipo = '';
        }

        $q = new Doctrine_Query();
        $result = $q->select("y.idnivelestructural as id, c.denominacion as text, y.*, h.*,c.*")
            ->from('NomNivelestructural y')
            ->innerJoin('y.NomnivelestructuralNomnivelestructural h')
            ->innerJoin('y.NomConceptonivel c')
            ->offset($start)
            ->limit($limit)
            ->where("h.idorigen='$idTabla' " . $sqlTipo)
            ->execute()->toArray();

        $aux = array();
        for ($i = 0; $i < count($result); $i++) {
            $temp['id'] = $result[$i]['idnivelestructural'];
            $temp['denominacion'] = $result[$i]['NomConceptonivel'][0]['denominacion'];
            $aux[] = $temp;
        }
        return $aux;
    }

    /**
     * Buscar todas las aristas de la tabla enviada
     * si se envia falso entonces buscar las que son raices
     *
     * @param int  $idTabla
     * @param bool $tipo
     *
     * @return array
     */
    function buscarConexionesarbol($idTabla, $tipo)
    {
        $sqlTipo = '';
        $q = Doctrine_Query::create();
        /* Selecciono el concepto teniendo en cuanta la uri que me pasan por parametro */
        $idconcepto = $q->select('a.*')
            ->from('NomConcept a')
            ->where("a.uri= '$tipo'")
            ->execute()->toArray();

        if (!$idTabla) { //Para devolver todas las raices            
            $sqlTipo = "y.raiz='1' " . $sqlTipo;
            $result = $q->select("y.idnivelestructural as id, c.denominacion as text, y.*, c.*")
                ->from('NomNivelestructural y')
                ->innerJoin('y.NomConceptonivel c')
                ->where($sqlTipo)
                ->addWhere("y.idconceptoestructural=?", $idconcepto[0]['idconceptoestructural'])
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

            return $result;
        }
        $q = new Doctrine_Query();
        $result = $q->select("y.idnivelestructural as id, c.denominacion as text, y.*, h.*,c.*")
            ->from('NomNivelestructural y')
            ->innerJoin('y.NomnivelestructuralNomnivelestructural h')
            ->innerJoin('y.NomConceptonivel c')
            ->where("h.idorigen='$idTabla' " . $sqlTipo)
            ->addWhere("y.idconceptoestructural=?", $idconcepto[0]['idconceptoestructural'])
            ->execute()->toArray();
        return $result;
    }

    /**
     * Para cargar la estructura de la base legal, este metodo es implementado
     * como parte del servicio que brinda esta configsecodena
     *
     * @param int $node
     *
     * @return array
     */
    function cargarEstruturabaselegal($node)
    {
        $datos = NomBaselegal::cargarEstructuraplan($node);
        return $datos;
    }

    /**
     * Para cargar la estructura de la base legal, este metodo es implementado
     * como parte del servicio que brinda esta configsecodena
     *
     * @param string $descripcion
     *
     * @return array
     */
    function cargarEstruturabaselegaldenominacion($descripcion)
    {
        $datos = NomBaselegal::cargarEstruturabaselegaldenominacion($descripcion);
        return $datos;
    }

    /**
     * Para cargar la estructura del DPA, este metodo es implementado
     * como parte del servicio que brinda esta configsecodena
     *
     * @param int $node
     * @param int $idpais
     *
     * @return array
     */
    function cargarEstruturadpa($node, $idpais)
    {
        $idpais = ($idpais) ? $idpais : Zend_Registry::getInstance()->config->idpais;
        $sistemas = NomDpa::cargarEstructura($node, $idpais);
        return $sistemas;
    }

    /**
     * Para devolver los padres de un elemento determinado
     *
     * @param int $iddpa
     *
     * @return array
     */
    function damePadresiddpa($iddpa)
    {
        return NomDpasecodena::buscarPadres($iddpa);
    }

    /**
     * Para devolver los padres de un elemento determinado
     *
     * @param int $idbaselegal
     *
     * @return array
     */
    function damePadresidbaselegal($idbaselegal)
    {
        return NomBaselegal::buscarPadres($idbaselegal);
    }

    /**
     * Obtiene un arreglo con los datos del nomenclador que se
     * encontro dado el id del mismo
     *
     * @author     Livan A Capote Valdés
     *
     * @param int $id    -El valor que se va a buscar
     * @param int $campo -Campo por el que se va a realizar la consulta casi siempre es el id de la Tabla
     * @param int $tabla -Nombre de la Tabla
     *
     * @return array
     */
    function getiddatosTabla($campo, $tabla, $id)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('*')
            ->from($tabla)
            ->where("$campo = $id")
            ->execute()->toArray();
        return array('cantidad_filas' => count($result), 'root' => $result);
    }

    /**
     * Obtiene los países
     *
     * @param array $arrCond
     *
     * @return array
     */
    function obtenerPaises($arrCond)
    {
        return NomPaissecodena::gettodos($arrCond);
    }

    /**
     * Obtiene los NomPaíses
     *
     * @param array $arrCond
     *
     * @return array
     */
    function obtenerNomPaises($arrCond)
    {
        return NomPais::obtenerNomPaises($arrCond);
    }

    /**
     * Obtiene el país
     *
     * @param int $idPais
     *
     * @return array
     */
    function obtenerPais($idPais)
    {
        return NomPaissecodena::getPais($idPais);
    }

    /**
     * Obtiene los niveles dado el país
     *
     * @param int $idpais
     *
     * @return array
     */
    function obtenerNivelesDadoPais($idpais)
    {
        return NomDpasecodena::obtenerNivelesDadoPais($idpais);
    }

    /**
     * Para mostrar los campos EAV
     *
     * @param int $limit   Límite superior
     * @param int $start   Comienzo inferior
     * @param int $idtabla Identificador de tabla
     *
     * @author Livan A Capote Valdes
     * @return array
     */
    function buscarCampos($limit, $start, $idtabla)
    {
        return NomCamponiveleav::buscarCampos($limit, $start, $idtabla);
    }

    /**
     * Para insertar los campos EAV
     *
     * @param int    $pidnomeav
     * @param string $pnombre
     * @param mixed  $ptipo
     * @param mixed  $plongitud
     * @param string $pnombremostrar
     * @param mixed  $pregex
     * @param mixed  $visible
     * @param mixed  $tipocampo
     * @param string $descripcion
     * @param mixed  $orden
     * @param mixed  $actual
     * @param mixed  $obligatorio
     * @param mixed  $visible
     *
     * @author Livan A Capote Valdes
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    function insertarcampos(
        $pidnomeav, $pnombre, $ptipo, $plongitud, $pnombremostrar, $pregex, $visible, $tipocampo, $descripcion, $orden,
        $actual, $obligatorio//, $visible
    )
    {
        $objeto = new NomCamponiveleav();

        //-- verificar que no se repita el campo en la tabla
        $query = Doctrine_Query::create();

        $result = $query->from('NomCamponiveleav ')
            ->where("idconceptoestructural='$pidnomeav' AND nombre='$pnombre'")
            ->execute()->count();
        if ($result > 0) {
            return false;
        }
        //-- insertar los valores
        //$objeto->idcampo = $idCampoNuevo;
        $objeto->idconceptoestructural = $pidnomeav;
        $objeto->nombre = $pnombre;
        $objeto->tipo = $ptipo;
        $objeto->longitud = $plongitud;
        $objeto->nombre_mostrar = $pnombremostrar;
        $objeto->regex = $pregex;
        $objeto->visible = $visible;
        $objeto->tipocampo = $tipocampo;
        $objeto->descripcion = $descripcion;
        $objeto->orden = $orden;
        $objeto->obligatorio = $obligatorio;
        $objeto->actual = $actual;
        $objeto->eliminable = 1;
        try {
            $objeto->save();
            return $objeto->idcampo;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo (__FILE__ . ' ' . __LINE__ . ' ' . $ee->getMessage());
            }
            return false;
        }
    }

    /** --------------------------------------------
     * Obtiene las filas de una tabla
     *
     * @param int $idTabla
     *
     * @return array
     */
    function buscarFilas($idTabla)
    {
        return NomFilaestruceav::buscarFilas($idTabla);
    }

    /**
     * Inserta un valor nuevo
     *
     * @param int   $idcampo
     * @param int   $id
     * @param mixed $valor
     *
     * @return bool
     */
    function insertarValores($idcampo, $id, $valor)
    {
        $objeto = new NomValorDefectoeav();
        $objeto->idcampo = $idcampo;
        $objeto->valor = $valor;
        $objeto->valorid = $id;
        $objeto->save();
        return true;
    }

    /**
     * Para modificar los campos
     *
     * @param int    $idcampo
     * @param int    $pidnomeav
     * @param string $pnombre
     * @param mixed  $ptipo
     * @param mixed  $plongitud
     * @param string $pnombremostrar
     * @param mixed  $pregex
     * @param mixed  $visible
     * @param mixed  $tipocampo
     * @param string $descripcion
     *
     * @author Livan A Capote Valdes
     * @return bool
     */
    function modificarcampos(
        $idcampo, $pidnomeav, $pnombre, $ptipo, $plongitud, $pnombremostrar, $pregex, $visible, $tipocampo,
        $descripcion
    )
    {
        $this->instance = $this->conn->getTable('NomCamponiveleav')->find($idcampo);
        $this->instance->nombre = $pnombre;
        $this->instance->tipo = $ptipo;
        $this->instance->longitud = $plongitud;
        $this->instance->nombre_mostrar = $pnombremostrar;
        $this->instance->regex = $pregex;
        $this->instance->visible = $visible;
        $this->instance->tipocampo = $tipocampo;
        $this->instance->descripcion = $descripcion;
        $this->instance->save();
        return true;
    }

    /**
     * Para eliminar los valores dado el campo
     *
     * @param int $idcampo Identificador de campo
     *
     * @author Livan A Capote Valdes
     * @return bool
     */
    function eliminarValorporCampo($idcampo)
    {
        $query = Doctrine_Query::create();
        $query->delete('idvalordefecto')->from('NomValorDefectoeav')
            ->where("idcampo = '$idcampo'")
            ->execute();
        return true;
    }

    /**
     * Obtiene a que tabla pertenece un campo detereminado
     *
     * @param int $idCampo Identificador de campo
     *
     * @return array
     */
    function buscarTablaPertenece($idCampo)
    {

        $query = Doctrine_Query::create();
        $result = $query->select('t.*,c.*')->from('NomConcept t')->innerJoin('t.NomCamponiveleav c')->where(
            "c.idcampo='$idCampo'"
        )->execute()->toArray();
        $arreglo = isset($result [0]) ? $result [0] : array();
        return $arreglo;
    }

    /**
     * Obtiene a que tabla pertenece un campo detereminado
     *
     * @param int $idCampo Identificador de campo
     *
     * @return bool
     */
    function cambiaractual($id)
    {
        $this->instance = Doctrine::getTable('NomCamponiveleav')->find($id);
        //$this->instance->actual = 0;
        $this->instance->delete();
        return true;
    }

    /**
     * Para devolver los valores de NomValorDefectoeav
     *
     * @param int $idCampo Identificador de campo
     *
     * @author Livan A Capote Valdes
     * @return array
     */
    function buscarValoresCampo($idcampo)
    {
        return NomValorDefectoeav::buscarValoresCampo($idcampo);
    }

    /**
     * Función que se utiliza para devolver el espacio de trabajo
     *
     * @param int $idsubsistema Identificador de subsistema
     * @param uri $uri          Uri
     *
     * @return object
     */
    function getEspaciotrabajo($idsubsistema, $uri)
    {
        $documento = NomTipodocumento::getElementByUri($uri);
        $espaciotrabajo = NomTipodocumentoNomSubsistema::gettipodocumentosubsistema(
            $idsubsistema, $documento[0]['idtipodocumento']
        );
        $aux = array();
        if ($espaciotrabajo[0]['idespaciotrabajo'] != '') {
            $aux['idespaciotrabajo'] = $espaciotrabajo[0]['idespaciotrabajo'];
            return $aux;
        } else {
            return $aux;
        }
    }

    /**
     * Función que se utiliza para devolver los tipos de documento de un susbsistema
     *
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return array
     */
    function getTiposDocumento($idsubsistema)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('td.idtipodocumento,td.denominacion,td.uri')
            ->from('NomTipodocumento td')
            ->innerJoin('td.NomTipodocumentoNomSubsistema tds')
            ->where('tds.idsubsistema = ?', $idsubsistema)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Para devolver los datos asociados a una Base legal
     *
     * @param array $arrayidbaselegal Arreglo de ID de las Bases legales
     *
     * @return array
     * @author Liv\xE1n Capote Valdés
     */
    function obtenerBaseLegalId($arrayidbaselegal)
    {
        return NomBaselegal::obtenerBaseLegalId($arrayidbaselegal);
    }

    /**
     * Función que obtiene el espacio de trabajo asociado a un subsistema
     *
     * @param int $idsubsistema ID de subsistema
     *
     * @return code Código de respuesta
     */
    function getEspaciotrabajoporsubsistema($idsubsistema)
    {
        return NomTipodocumentoNomSubsistema::obtenerespaciotrabajoporsubsistema($idsubsistema);
    }

}
