<?php

/**
 * Clase especializada en el trabajo con los servicios que se utilizan
 * de estructura y composicion
 *
 *
 */
class ServiciosEstructuraComposicionHelper implements ISingletonClass
{

    const TIPO_PUERTO = -4;
    const TIPO_DEPOSITO = -5;

    /**
     * Una instancia unica de ServiciosEstructuraComposicionHelper
     *
     * @var ServiciosEstructuraComposicionHelper
     */
    private static $instance = null;

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Creates a new instance of class ServiciosEstructuraComposicionHelper
     *
     * @return ServiciosEstructuraComposicionHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosEstructuraComposicionHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve los datos de grados militares
     *
     * @param
     *
     * @return array
     */
    public function buscarGradosMilitar($numerosub, $bandera)
    {

        try {
            /**
             * @todo buscar que significan los parametros 100 y 0
             */
            return $this->integrator->metadatos->BuscarGradosMilitar($numerosub, $bandera);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los datos del padre d euna entidad
     *
     * @param $idestructura
     *
     * @return array
     */
    public function obtenerPadreEntidad($idestructura)
    {

        try {

            return $this->integrator->metadatos->obtenerPadreEntidad($idestructura);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve las estructuras internas de una e
     * structura mas general
     *
     * @param buscar  que significan los parametros 100 y 0
     * @param numeric idestructura
     *
     * @return stdClass
     */
    public function getEstructurasInternas($idestructura)
    {

        try {
            /**
             * @todo a este metodo se le puede pasar otro parametro buscar cual es
             */
            return $this->integrator->metadatos->DameEstructurasInternas($idestructura);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve la interfaz de estructura
     *
     * @return js
     */
    public function obtenerIUEstructura()
    {

        try {
            return $this->integrator->metadatos->obtenerIUEstructura();
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve las areas de un deposito
     *
     * @param iddeposito numeric
     *
     * @return array
     */
    public function getAreasPorId($iddeposito)
    {

        try {
            return $this->integrator->metadatos->DameAreasPorId($iddeposito);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve las estructuras de un dominio
     *
     * @param $iddominio
     *
     * @return array
     */
    public function getEntidadesByDominio($iddominio, $permisos = FALSE, $denominaciones = FALSE)
    {

        try {
            return $this->integrator->metadatos->EntidadesByDominio($iddominio, $permisos,$denominaciones);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve las areas de un deposito
     *
     * @return stdClass
     */
    public function getEstructura($idestructura = null, $filtro = false)
    {

        try {
            $cond = '';
            if($filtro != false){
                $cond.= "AND (v.codigo ilike '%{$filtro}%' OR v.denominacion ilike '%{$filtro}%')" ;
            }
            $sql = "select v.idestructura as id, v.idestructura, v.denominacion as text, v.denominacion, v.codigo, v.idestructura
                    from mod_estructuracomp.v_dametodasestructuras v where v.idestructura = {$idestructura}";
            $datos = LogisticaDoctrineHelper::__init()->executeQuery($sql)->fetchAll(PDO::FETCH_OBJ);
            return count($datos) > 0 ? $datos : array()/*$this->integrator->metadatos->DameEstructura($idestructura)*/;
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve las estructuras no formales
     *
     * @param iddominio (identificador del dominio)
     *                  idrama(Identificador de de alguna hoja)
     * filtro para filtrar por la denominacion(ejemplo filtro = 'deposito1')
     * limit y start, $arryidestructura
     * area es el id si quiere los depositos (-2) o si quieres areas de responsabilidad(-1)
     *
     * @return array
     */
    public function obtenerEstructurasNoFormales($iddominio = false, $idrama = null, $filtro = false, $limit = null,
        $start = null, $arryidestructura = null, $areas = -1
    )
    {

        try {   
            return $this->integrator->metadatos->ObtenerEstructurasNoFormales($iddominio, $idrama, $filtro, $limit,
                    $start, $arryidestructura, $areas);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve el padre inmediato de un hijo d una subordinacion
     * @params $idhijo, $idSubordinacion, excluir(array de idestructuras a excluir)
     * @return stdClass
     */
    public function buscarPadrePorSubordinacion($idhijo, $idSubordinacion,$idsExcluir)
    {
        try {
            /**
             * @todo ver que significa el 2 que le pasan como segundo parametro
             */
            return $this->integrator->metadatos->BuscarPadrePorSubordinacion($idhijo, $idSubordinacion,$idsExcluir);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los hijos por subordinacion de una entidad especifica
     *@param $idSubordinacion, $idpadre, excluir(array de idestructuras a excluir)
     * @return stdClass
     */
    public function buscarHijoPorSubordinacion($idpadre,$idSubordinacion,$idsExcluir)
    {

        try {
            /**
             * @todo ver que significa el 2 que le pasan como segundo parametro
             */
            return $this->integrator->metadatos->BuscarHijoPorSubordinacion($idpadre,$idSubordinacion,$idsExcluir);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los hijos de una entidad especifica
     * @params $idestructura
     *
     * @return array
     */
    public function getHijosInterna($nodo)
    {

        try {
            return $this->integrator->metadatos->DameHijosInternas($nodo);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve un query para obtener las areas
     * @params $query un objeto de Doctrine_query, $aliastablainterna
     * alias de la tabla tuya,$aliastablaexterna el alias que quieres
     * que tenga la tabla de estructura
     *
     * @return Doctrine_query
     */
    public function DameAreasPorJoin($query, $aliastablainterna, $aliastablaexterna)
    {

        try {
            return $this->integrator->metadatos->DameAreasPorJoin($query, $aliastablainterna, $aliastablaexterna);
        } catch (Exception $e) {
            
        }
    }

    /**
     * Metodo para ralizar un filtro de nomfila
     * @parm $dql(Objeto Doctrine_query),$aliasExterna(alias de la tabla externa)
     * $campoExterno(campo por el que se va a filtrar), $idestructuta
     *
     * @RETURN Doctrine_Query
     */
    public function obtenerDqlNomFilaHijos($dql, $aliasExterna, $campoExterno, $idestructuta)
    {
        try {
            return $this->integrator->metadatos->obtenerDqlNomFilaHijos(
                    $dql, $aliasExterna, $campoExterno, $idestructuta
            );
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo para buscar el arbol de hijo dado juna estructura
     * @parm $iddominio, $idestructura, $checked, $chekear, $arrayTiposEAV
     *
     * @RETURN array
     */
    public function buscarHijosEstructurasLineal($iddominio = null, $idestructura = null, $checked = null,
        $chekear = null, $arrayTiposEAV = null
    )
    {
        try {
            return $this->integrator->metadatos->buscarHijosEstructurasLineal(
                    $iddominio, $idestructura, $checked, $chekear, $arrayTiposEAV
            );
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function idEstructurasDominio($iddominio)
    {
        try {
            return $this->integrator->metadatos->IdEstructurasDominio($iddominio);
        } catch (Exception $e) {
            return array();
        }
    }
    
    /**
     * Meotdo para obtener las subordinaciones que estan nomencladas
     * @param filtro, limit, start
     * @return type
     */
    public function obtenerSubordinaciones($filtro= false, $limit, $star)
    {
        try {
            return $this->integrator->metadatos->obtenerSubordinaciones($filtro, $limit, $star);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    
    /**
     * Meotodo para obtener las estructuras hijas segun sus identificador
     * @param type $idDominioPermiso
     * @param type $idEstructura
     * @param type $checked
     * @param type $soloAreasResp
     * @return array
     */
    public function getEstructurasHijasById($idDominioPermiso= 0, $idEstructura= 0,$checked= false,$soloAreasResp= false)
    {
        try {
            
            return $this->integrator->metadatos->getEstructurasHijasById($idDominioPermiso, $idEstructura,$checked,$soloAreasResp);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    
    public function buscarEntidadbyDominio($idEstructura)
    {
        try {
            
            return $this->integrator->metadatos->BuscarEntidadbyDominio($idEstructura);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    
	public function obtenerEstructuras($idEntidad, $excluir = false, $criterio= false){
		$sql = "select vdm.idestructura, vdm.codigo, vdm.denominacion
                from mod_estructuracomp.nom_filaestruc f
                inner join mod_estructuracomp.v_dametodasestructuras vdm on f.idfila = vdm.idestructura

                where /*f.parent_path 
                OPERATOR(public.>=)(

                SELECT
                nf.parent_path
                from mod_estructuracomp.nom_filaestruc nf
                inner join mod_estructuracomp.dat_estructura de on nf.idfila = de.idestructura 
                where nf.parent_path OPERATOR(public.<)
                (
                        select e.parent_path
                                from mod_estructuracomp.nom_filaestruc e
                                where e.idfila = {$idEntidad}
                ) order by nf.idfila desc limit 1)
                and*/ (vdm.idconcepto = 3 or (vdm.idconcepto = 5 and vdm.idorgano = -2))";
                                                        
                if($criterio){
                    $sql .= " AND ( vdm.codigo ilike '%{$criterio}%'
                                   OR  vdm.denominacion ilike '%{$criterio}%') ";
                }
                
                if($excluir){
                    $excluir = is_array($excluir)? implode(",",$excluir):$excluir;
                    $sql .= " AND  f.idfila NOT IN ($excluir) ";
                }
                                                        
                                                        
                                                        
		return LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);		
	}
 
    public function obtenerPuertos(){
        try {
            $sql = sprintf("select from mod_estructuracomp.nom_filaestruc f
                        inner join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = f.idfila
                        where eop.idorgano = %s", ServiciosEstructuraComposicionHelper::TIPO_PUERTO) ;
            LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);
        }
        catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }
    public function obtenerDepositosPuerto($idPuerto){
        try {
            $sql = sprintf("select from mod_estructuracomp.nom_filaestruc f
                        inner join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = f.idfila
                        where eop.idorgano = %s and f.idpadre = %s", 
                    ServiciosEstructuraComposicionHelper::TIPO_DEPOSITO, $idPuerto) ;
            return LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);
        }
        catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }
    
   	public function obtenerEstructurasNoFormalesPorEntidad($idEntidad, $criterio = false, $self = false){
		$parent_path = LogisticaDoctrineHelper::__init()->getConnection()
				->execute("select	e.parent_path
							from mod_estructuracomp.nom_filaestruc e 
				where e.idfila = $idEntidad")
				->fetchAll(PDO::FETCH_OBJ);
		$parent_path = $parent_path[0]->parent_path;
        $filtro = '';
		$filtro .= ($self)?" and m.idestructura = $idEntidad ":"and m.idestructura in (select n.idfila
			from mod_estructuracomp.nom_filaestruc n
			where n.parent_path operator(public.~)'{$parent_path}.*'
			and n.idfila <> n.idpadre) ";
		$filtro .= ($criterio)?" and m2.denominacion ilike '%{$criterio}%' or (select m2.codigo ilike '%{$criterio}%' and m.idestructura in (select n.idfila
			from mod_estructuracomp.nom_filaestruc n
			where n.parent_path operator(public.~)'{$parent_path}.*'
			and n.idfila <> n.idpadre)) ":"";
    
		$sql = "SELECT m2.idestructuraop as idfila, m2.idestructuraop, m2.idproyecto, m2.codigo ,m2.denominacion,m.idestructura
            FROM mod_estructuracomp.dat_estructuraop m2
            INNER JOIN mod_estructuracomp.v_dametodasestructuras m on m.idestructura = m2.idestructuraop
            INNER JOIN mod_estructuracomp.nom_organo m3 ON m2.idorgano = m3.idorgano 
            WHERE m2.idconcepto = 8 AND m2.idorgano = -1 $filtro
            ORDER BY m2.codigo";
		return LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);		
	}

}
