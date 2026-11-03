<?php

  /***
   * Class EstructuraService
   * Descripción de la clase: Contiene los servicios del componente estructura
   *
   * @author    : Ing. Javier Limonta
   * @modify    : Ing. Daymel Machado
   * @modify    : Ing. Osvaldo M. Gonzalez
   * @copyright Copyright (c) 2013 xetid
   */
  class EstructuraService extends ZendExt_Model
  {
    /**
     * Referencia al modelo para manejar las estructuras
     *
     * @var EstructuraModel
     */
    var $estructura;
    /**
     * Referencia al modelo para manejar las estructuras internas
     *
     * @var EstructuraopModel
     */
    var $estructuraop;
    /**
     * Referencia al modelo para manejar las fila
     *
     * @var EstructuraopModel
     */
    var $fila;

    /** Constructor de la interfaz, destinado a reservar para objetos de tipo model
     *
     * @return \EstructuraService nj
     */
    function __construct()
    {
      $this->estructura    = new EstructuraModel();
      $this->datestructura = new DatEstructuraModel();
      $this->estructuraop  = new EstructuraopModel();
      $this->fila          = new FilaModel();
    }

    /**
     * Obtener los cargos que pertenecen a la estructura
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $idestructura
     * @param $dominio
     * @param $datos
     *
     * @return array
     */
    function obtenerCargosEstructura($idestructura, $dominio = true, $datos = true)
    {
      $cargos = $this->estructura->obtenerCargosXIdestructura($idestructura, $dominio);
      $result = array();
      if ($datos === true) {
        foreach ($cargos as $cargo) {
          $dato = $this->estructura->dameDatosEstructura($cargo['idcargo'], false, false, true);
          if (count($dato[0]) > 0) {
            $result[] = $dato[0];
          }
        }

        return $result;
      }

      return $cargos;
    }

    /**
     * Obtener los cargos inmediatos que pertenecen a la estructura
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param array           $idestructura
     * @param integer|boolean $dominio
     * @param boolean         $datos
     *
     * @return array
     */
    function obtenerCargosEstructuraInmediato($idestructura, $dominio = false, $datos = false)
    {
      $response = array();
      if (is_array($idestructura)) {
        foreach ($idestructura as $valor) {
          $resultado = $this->datestructura->dameCargosInEstructura($valor, false, false, $dominio);
          $directos  = $resultado['directos'];
          if ($datos) {
            $response = array_merge($response, $directos);
          } else {
            $arrayIds = array();
            foreach ($directos as $cargo) {
              $arrayIds[] = $cargo['id'];
            }
            $response = array_merge($response, $arrayIds);
          }
        }
      } else {
        $resultado = $this->datestructura->dameCargosInEstructura($idestructura, false, false, $dominio);
        $directos  = $resultado['directos'];
        if ($datos) {
          $response = $directos;
        } else {
          $arrayIds = array();
          foreach ($directos as $cargo) {
            $arrayIds[] = $cargo['id'];
          }
          $response = $arrayIds;
        }
      }

      return $response;
    }

    /**
     * Obtener el padre que sea de tipo entidad
     *dame
     *
     * @author  : Ing.Daymel machado
     *
     * @param $idhijo
     *
     * @return array
     */
    function obtenerPadreEntidad($idhijo, $profundidad = false)
    {

      $padre = $this->fila->damePadreEstructura($idhijo);
      $id    = $padre[0]['identificador'];
      $tipo       = $this->fila->obtenerTipoEstructura($id);
      $idconcepto = $tipo[0]['tipo'];

      if ($idconcepto == 3 || $idconcepto == 4 || $idconcepto == 1) {

        if ($profundidad === true) {
        
          if ($idhijo == $id) {
            return $this->dameEstructura($id);
          }else{
            return $this->obtenerPadreEntidad($id,true);
          }
        } else {
          return $this->dameEstructura($id);
        }

      } else {
        return $this->obtenerPadreEntidad($id,$profundidad);
      }
    }

    /**
     * Obtiene la ruta de una estructura especificada
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param arrayEstructura
     * @param $datos
     *
     * @return array :array Retorna un arreglo con un texto de la ruta de la estructura y el id de la misma
     */
    function dameRutaEstructura($arrayEstructura, $datos)
    {

      $estructuraModel = new EstructuraModel();
      $resultado       = $estructuraModel->dameRutaEstructura($arrayEstructura, $datos);

      return $resultado;
    }

    /**
     * Obtiene todas las estructuras no formales segun el dominio especificado
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     * @modified: Ing.Daymel Machado
     *
     * @param bool       $iddominio
     * @param bool       $idrama
     * @param bool       $filtro
     * @param int        $limit
     * @param int        $start
     * @param int|string $idestructura
     * @param int        $area
     *
     * @return \Doctrine_Collection : array Retorna un arreglo con los datos de las estructuras no formales
     */
    function obtenerEstructurasNoFormales(
      $iddominio = false, $idrama = false, $filtro = false, $limit = 1000, $start = 0, $idestructura = "",
      $area = 0
    )
    {
      $objectModel = new EstructuraopModel();
      if (!is_numeric($iddominio)) {
        $perfil    = ZendExt_GlobalConcept::getInstance()->Perfil;
        $iddominio = $perfil->iddominio;
      }
      $resultado = $objectModel->obtenerEstructurasNoFormales(
        $iddominio, $idrama, $filtro, $limit, $start, $idestructura, $area
      );

      return $resultado;
    }

    /**
     * Devuelve un arreglo con los datos de la estructura
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $idEstructura
     *
     * @return array|null : array Retorna un arreglo con los datos de la estructura especificada
     */
    function dameEstructura($idEstructura)
    {
      $arraydata = $this->estructura->dameDatosEstructura($idEstructura, false, false, true);
      $result    = ZendExt_ClassStandard::ArrayObject($arraydata);

      return $result;
    }

    /**
     * Devuelve un arreglo con los datos de las estructuras
     *
     * @author  : Ing.Osvaldo Gonzalez
     *
     * @param $arrayIdEstructura
     *
     * @return array Retorna un arreglo con los datos de las estructuras especificadas
     */
    function dameEstructurasByArrayId($arrayIdEstructura)
    {
      $result = array();
      foreach ($arrayIdEstructura as $id) {
        $result[] = $this->dameEstructura($id);
      }

      return $result;
    }

    /**
     * Devuelve toda una rama de estructura a partir de un identificador
     *
     * @author  : Ing.Osvaldo Gonzalez
     *
     * @param $idEstructura
     *
     * @return array Retorna un arreglo con todo la rama a partir de un id
     */
    function dameArbolEstructura($idEstructura)
    {
      $result = array();
      $arbol  = $this->estructura->dameArbolEstructura($idEstructura);
      if (count($arbol)) {
        $result = Util::construirArbol($arbol);
      }

      return $result;
    }

    /**
     * Obtiene la estructura cuyo codigo es el especificado
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $codigo Codigo de la estructura
     *
     * @return bool|\Doctrine_Collection : array Retorna un arreglo con los datos de la estructura especificada
     */
    function dameEstructuraPorCodigo($codigo)
    {
      return $this->estructura->dameEstructuraPorCodigo($codigo);
    }

    /**
     * Devuelve todas las estructuras pero de manera lineal
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $limit  Limite de elementos
     * @param $start  Posicion de inicio
     *
     * @return array : array Retorna un arreglo con todas las estructuras
     */
    function dameTodasEstructuras($limit, $start,$soap = false)
    {
      if($soap){
        $arraydata = $this->estructura->dameTodasEstructurasSoap($limit, $start);
      }else{
        $arraydata = $this->estructura->dameTodasEstructuras($limit, $start);
      }


      return $arraydata;
    }

    /**
     * Buscar todos los hijos de una estructura
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $idPadre   identificador de la estructura padre
     *
     * @return array|null : array Retorna un arreglo con todas las estructuras hijas
     */
    function dameHijosEstructura($idPadre, $arrayExcluir = false)
    {
      $arraydata = $this->estructura->dameHijosEstructura($idPadre, 0, 0, 0, true, true,$arrayExcluir);
      $result    = ZendExt_ClassStandard::ArrayObject($arraydata);

      return $result;
    }

    /**
     * Buscar todos los hijos de una estructura mientras sean solo organos, entidades u organizaciones
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $idPadre   identificador de la estructura padre
     *
     * @return array|null : array Retorna un arreglo con todas las estructuras hijas
     */
    function dameHijosEstructuraArea($idPadre)
    {
      $arraydata = $this->estructura->dameHijosEstructuraArea($idPadre);
      $result    = ZendExt_ClassStandard::ArrayObject($arraydata);

      return $result;
    }

    /**
     * Obtiene todas las estructuras internas con su denominacion segun el tipo
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $idEstructura Identificador de la estructura
     *
     * @return Retorna un arreglo con los datos de las estructura interna definida
     */
    function dameAreasPorId($idEstructura)
    {
      return $this->estructuraop->obtenerDatosArea($idEstructura);
    }

    /**
     * Obtiene todas las denominaciones de las estructuras
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $array Arreglo de identificadores
     *
     * @return Retorna un arreglo con los datos de las estructura interna definida
     */
    function dameDenominacionPorArregloIdEstructuras($array)
    {
      return $this->estructura->dameDenominacionPorArregloIdEstructuras($array);
    }

    /**
     * Buscar todas las estructuras que coincidan con el arreglo insertado
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $array        Arreglo de identificadores de estructuras
     * @param $idEstructura Identificador de la estructura
     *
     * @return array : array Retorna un arreglo con todas las estructuras
     */
    function obtenerArbolPorNodos($array, $idEstructura)
    {
      if ($idEstructura == 0) {
        $idEstructura = false;
      }
      $datos  = $this->estructura->dameHijosEstructura($idEstructura, false, false, 0, true, false, true);
      $result = $this->estructura->dameEstructrurasPorNodos($datos, $array);

      return $result;
    }

    /**
     * Buscar todas las entidades dentro de una estructura especificada
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $idEstructura  Identificador de la estructura
     *
     * @return array|null : array Retorna un arreglo con todas las entidades encontradas
     */
    function buscarEntidadPorEstructura($idEstructura)
    {
      $perfil      = ZendExt_GlobalConcept::getInstance()->Perfil;
      $idDominio   = $perfil->iddominio;
      $objectModel = new EstructuraModel();
      $data        = $objectModel->buscarEntidadPorEstructura($idEstructura, $idDominio, false, true);

      return ZendExt_ClassStandard::ArrayObject($data);
    }

    /**
     * Buscar todas las estructuras dentro de una especificada que cumpla con los parametros definidos
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param        $idestructura  Identificador de la estructura
     * @param int    $start         Inicio de lectura
     * @param int    $limit         Limite de elementos a mostrar
     * @param int    $codigo        Codigo de la estructura
     * @param int    $denominacion  Denominacion de la estructura
     * @param string $idconcepto    Identificador del concepto
     * @param string $iddpa         Identificador del codigo regional
     *
     * @return array : array Retorna un arreglo con todas las estructuras encontradas
     */
    function dameElementosInternos(
      $idestructura, $start = 0, $limit = 15, $codigo = 0, $denominacion = 0, $idconcepto = "", $iddpa = ""
    )
    {
      $objectModel = new EstructuraModel();
      $resultado   = $objectModel->dameElementosInternos(
        $idestructura, $start, $limit, $codigo, $denominacion, $idconcepto, $iddpa
      );

      return $resultado;
    }

    /**
     * Buscar todas las estructuras dentro de una especificada que cumpla con los parametros definidos
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $iddominio
     * @param $filtro
     * @param $identificadores
     *
     * @return array : array Retorna un arreglo con todas las estructuras encontradas
     */
    function obtenerEstructurasPorFiltroDenominacion($iddominio, $filtro, $identificadores)
    {
      $objectModel = new EstructuraModel();

      return $objectModel->dameEstructurasPorDenominacion($iddominio, $filtro, $identificadores);
    }

    /**
     * Buscar todas las dentro de una especificada que cumpla con los parametros definidos
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Daymel Machado
     *
     * @param $idEstructura
     *
     * @return array : array Retorna un arreglo con todas las estructuras encontradas
     */
    function DameEstructurasInternas($idEstructura)
    {
      $resultado = array();
      $arraydata = $this->estructura->dameHijosEstructura($idEstructura, false, false, 0, true, false, true);
      $index     = 0;
      if (count($arraydata) > 0) {
        foreach ($arraydata as $data) {
          if ($this->verificaIntCargosMedios($data)) {
            $resultado [] = $data;
            if ($data['interna']) {
              if ($this->estructura->verificarHojaArea($data['id'])) {
                $resultado [$index]['leaf'] = true;
              }
            }
            $index++;
          }
        }
      }

      return $resultado;
    }

    /**
     * Verifica si existe una estructura interna especificada
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Daymel Machado
     *
     * @param $idEstructura
     *
     * @return \unknown : bool
     */
    function ExisteEstructuraOp($idEstructura)
    {
      return $this->estructuraop->existeEstructruraInterna($idEstructura);
    }

    /**
     * Verifica si existen las estructuras dado un array de ID
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Daymel Machado
     *
     * @param $arrayIdEstructura
     *
     * @return array : array
     */
    function ExistenEstructuras($arrayIdEstructura)
    {
      return $this->estructura->dameEstructurasPorArregloIds($arrayIdEstructura);
    }

    /**
     * Devuelve un arreglo con el listado de las estructuras internas paginados
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Daymel Machado
     *
     * @param int $limit
     * @param int $start
     *
     * @return array : array
     */
    function ListadoEstructurasInternas($limit = 10, $start = 0)
    {
      $this->estructuraop->initConnection('metadatos');

        $arraydata = $this->estructuraop->buscarEstructuraInterna($limit, $start);


      $result    = ZendExt_ClassStandard::ArrayObject($arraydata ['datos']);

      return array('cant' => $arraydata ['cant'], 'datos' => $result);
    }

    /**
     * Devuelve los hijos de la estructura interna seleccionada
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Daymel Machado
     *
     * @param      $idPadre
     * @param bool $oi
     *
     * @return array|null : array
     */
    function DameHijosInternas($idPadre, $oi = false)
    {
      $arraydata = $this->estructura->dameEstructurasInternas($idPadre, $oi);
      $result    = ZendExt_ClassStandard::ArrayObject($arraydata);

      return $result;
    }

    /**
     * Retorna un arreglo de estructuras  sin chequear
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Daymel Machado
     *
     * @param $idEstructura
     *
     * @return array : array
     */
    function DameEstructurasinChecked($idEstructura)
    {
      return $this->estructura->dameEstructurasinChecked($idEstructura);
    }

    /**
     * Descripción del método : Obtener las estructuras internas hijas de una especificada
     *
     * @author  : Ing.Osvaldo Manuel Gonzalez Ortiz
     *
     * @param $idPadre
     *
     * @return array Retorna un arreglo con los datos de las areas
     */
    function DameEstructurasInternasSeguridad($idPadre)
    {
      return $this->estructuraop->dameEstructurasInternasSeguridad($idPadre);
    }

    /**
     * Servicio para obtener la ventana de estructura, con sus funcionalidades
     *
     * @author    : Ing. Javier Limonta
     * @modifay   : Ing. Daymel Machado
     * @return void
     */
    function mostrarIUEstructura()
    {

      $dirApps = Zend_Registry::getInstance()->config->dir_aplication;

      return file_get_contents($dirApps . 'metadatos/estructura/services/iuEstructura/iuEstructura.phtml');
    }

    /**
     * Retorna un arreglo con las entidades que pertenecen a una estructura especificada
     *
     * @author   : Ing. Yadir Martinez Vergara
     * @modified : Ing.Osvaldo M. Gonzalez
     *
     * @param $idestructura
     *
     * @internal param $idEstructura
     * @return array : Arreglo de entidades
     */
    function obtenerEntidadesXidestructura($idestructura)
    {
      return $this->estructura->dameEntidadesDeEstructura($idestructura);
    }

    /**
     * Retorna un arreglo con los id de los cargos que se encuentren dentro de una estructura especificada
     *
     * @author  : Ing. Yadir Martinez Vergara
     * @modified: Ing.Osvaldo M. Gonzalez
     *
     * @param $idestructura
     *
     * @return array : Arreglo de identificadores de cargos
     */
    function obtenerCargosXidestructuraop($idestructura)
    {
      return $this->estructura->dameCargosPorEstructura($idestructura);
    }

    /**
     * Retorna un arreglo con la entidad padre de un cargo especificado
     *
     * @author  : Ing. Yadir Martinez Vergara
     * @modified: Ing.Osvaldo M. Gonzalez
     *
     * @param $idCargo
     *
     * @return array : Arreglo con los datos de la entidad
     */
    function obtenerEntidadXidcargo($idCargo)
    {
      return $this->estructura->dameEntidadPorCargo($idCargo);
    }

    /**
     * Retorna un arreglo con los datos del organismo (organo principal) al que pertenece
     *
     * @author  : Ing. Yadir Martinez Vergara
     * @modified: Ing.Osvaldo M. Gonzalez
     *
     * @param $idEstructura
     *
     * @return array : Arreglo con los datos de la entidad
     */
    function obtenerOrganismoxIdEntidad($idEstructura)
    {
      return $this->estructura->dameOrganismoRutaPorIdEstructura($idEstructura);
    }

    /**
     * Retorna un arreglo con las estructuras que conforman la ruta hacia la especificada
     *
     * @author  : Ing. Yadir Martinez Vergara
     * @modified: Ing Osvaldo M. Gonzalez
     *
     * @param $idEstructura
     *
     * @return array : Arreglo con los datos de las estructuras
     */
    function obtenerCaminoxIdEntidad($idEstructura)
    {
      return $this->estructura->dameOrganismoRutaPorIdEstructura($idEstructura, true);
    }

    /**
     * Busca los datos de los cargos especificados por el arreglo de ids
     *
     * @author  : Ing. Osvaldo M. Gonzalez
     *
     * @param $arrIdCargos
     *
     * @return array: Arreglo con los datos de los cargos
     */
    function obtenerdatosdelCargoporarrIDs($arrIdCargos)
    {
      return $this->estructura->dameCargosPorIds($arrIdCargos);
    }

    /**
     * Busca los datos de las estructuras especificadas
     *
     * @param $arrIdsEstructuras
     *
     * @author  : Ing. Yadir Martinez Vergara
     * @modified: Ing. Yoandry
     * @return   array: Arreglo con los datos de las estructuras obtenidas
     */
    function DevolverEstructurasxarrIDs($arrIdsEstructuras)
    {
      return $this->estructura->dameEstructurasPorArregloIds($arrIdsEstructuras);
    }

    /**
     * Busca los datos de los cargos especificados por el arreglo de ids
     *
     * @author  : Ing. Yadir Martinez Vergara
     * @modified: Ing. Osvaldo M. Gonzalez
     *
     * @param $arrIDsCargos
     *
     * @return array: Arreglo con los datos de los cargos
     */
    function obtenerdatosdelCargodadoArreglo($arrIDsCargos)
    {
      return $this->estructura->dameCargosPorIds($arrIDsCargos);
    }

    /**
     * Obtiene todas las denominaciones de las estructuras
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $arrIDs
     *
     * @return Retorna un arreglo con los datos de las estructura definidas
     */
    function obtenerDenomEstructuradadoArregloIDs($arrIDs)
    {
      return $this->estructura->dameDenominacionPorArregloIdEstructuras($arrIDs);
    }

    /**
     * Obtiene todos los identificadores de las estructuras internas a la especificada
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     *
     * @param $idestructura
     *
     * @return Retorna un arreglo con los identificadores de las estructuras incluyendo y excluyendo los cargos
     */
    function obtenerTodasestructurasinteriores($idestructura)
    {

      return $this->estructura->dameTodasEstructurasInternas($idestructura);
    }

    /**
     * Obtiene todos los conceptos existentes
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Osvaldo Gonzalez
     * @return Retorna un arreglo con los datos de los conceptos
     */
    function CargarIconosEAV()
    {
      return $this->estructura->cargarIconosEAV();
    }

    /**
     * Devuelve todos los cargos de los cargos dentro de la entidad definida por el codigo
     *
     * @author  : Ing.Osvaldo Gonzalez
     *
     * @param $codigo
     * @param $dominio
     *
     * @return array
     */
    function dameCargosXCodigoEstructura($codigo, $dominio)
    {
      $estructura = $this->estructura->dameEstructuraPorCodigo($codigo);
      $result     = array();
      $cargos     = $this->estructura->obtenerCargosXIdestructura($estructura[0]['id'], $dominio);
      foreach ($cargos as $cargo) {
        $datos    = $this->estructura->dameDatosEstructura($cargo['idcargo'], false, false, true);
        $result[] = $datos[0];
      }

      return $result;
    }

    /**
     * Obtener entidades daoo una denominación o un id de Organo
     *
     * @param $idorgano
     * @param $denom
     *
     * @return array
     */
    function dameEstructurasByOrg($idorgano, $denom)
    {
      $datos = $this->estructura->dameEstructuraByOrgano($idorgano, $denom);

      return $datos;
    }

    /**
     * @param $data
     *
     * @return bool
     */
    private function verificaIntCargosMedios($data)
    {
      return $this->estructura->existeEstructuraInterna($data['id']) && $data['idconcepto'] != 7 &&
      $data['idconcepto'] != 8;
    }

    /**
     * @param $dql
     * @param $alias
     * @param $campo
     * @param $idestructura
     *
     * @return mixed
     */
    function obtenerDqlNomFilaHijos($dql, $alias, $campo, $idestructura)
    {
      $dql->addWhere(
        "{$alias}.{$campo} IN
                 (SELECT nfesub.idfila FROM NomFilaestruc nfesub WHERE
                        (SELECT nfesub1.parent_path FROM NomFilaestruc nfesub1
                        WHERE nfesub1.idfila = {$idestructura}) operator (public.<@) nfesub.parent_path
                        
                 )"
      );

      return $dql;
    }

    /**
     * @param      $iddominio
     * @param bool $permisos
     *
     * @internal param $iddominio Obtener entidades de un dominio* Obtener entidades de un dominio
     * @return \Doctrine_Collection
     */
    function EntidadesByDominio($iddominio, $permisos = false, $denominacion = false)
    {
      if (!is_numeric($iddominio)) {
        $perfil    = ZendExt_GlobalConcept::getInstance()->Perfil;
        $iddominio = $perfil->iddominio;
      }
      $objectModel = new EstructuraModel();

      return $objectModel->dameEntidadesByDominio($iddominio, $permisos, $denominacion);
    }

    /**
     * @param      $idestructura

     *
     * @internal param $idestructura Obtiene las entidades o UEB hijas
     * @return \Doctrine_Collection
     */
    function dameHijasEntidadesoUEB($idestructura= false)
    {

      $objectModel = new EstructuraModel();

      return $objectModel->dameHijasEntidadesoUEB($idestructura);
    }
    /**
     * @param      $idestructura

     *
     * @internal param $idestructura Obtiene las obras hijas
     * @return \Doctrine_Collection
     */
    function dameHijasObras($idestructura= false)
    {

      $objectModel = new EstructuraModel();

      return $objectModel->dameHijasObras($idestructura);
    }

    /**
     * @param npublico
     * @param idorgano
     * @param idnomcargo
     *
     * @return array
     */
    function obtenerUbicacion($npublico, $idorgano, $idnomcargo)
    {
      $objectModel = new EstructuraModel();

      return $objectModel->obtenerUbicacion($npublico, $idorgano, $idnomcargo);
    }

    /**
     * @param      $array
     * @param bool $dominio
     *
     * @return mixed
     */
    function obtenerDenominacion($array, $dominio = false)
    {
      $perfil    = ZendExt_GlobalConcept::getInstance()->Perfil;
      $conn      = Zend_Registry::get('conexion');
      $iddominio = ($dominio) ? $dominio : $perfil->iddominio;
      $query
                 = "SELECT  idfila AS idestructura,
               CASE
                WHEN e.idestructura IS NOT NULL THEN e.denominacion
                WHEN eo.idestructuraop IS NOT NULL THEN eo.denominacion
                WHEN nomcvil.idnomcargo IS NOT NULL THEN nomcvil.denominacion
               END    AS denominacion
              FROM mod_estructuracomp.nom_filaestruc f
              LEFT JOIN mod_estructuracomp.dat_estructura e ON (e.idestructura = f.idfila and e.idproyecto = 0)
              LEFT JOIN mod_estructuracomp.dat_estructuraop eo ON (eo.idestructuraop = f.idfila and eo.idproyecto = 0)
              LEFT JOIN mod_estructuracomp.dat_cargo cargo ON ( cargo.idcargo = f.idfila and cargo.idproyecto = 0 )
              LEFT JOIN mod_estructuracomp.nom_cargo nomcvil ON ( cargo.idnomcargo = nomcvil.idnomcargo )
              WHERE idfila in (" . implode(',', $array) . ") and f.fechafin is null
              AND f.dominiofila['$iddominio'] = 1 :: bit";
      $result    = $conn->fetchAll($query);

      return $result;
    }

    /**
     * Devuelve un arreglo de idestructuras
     *
     * @param int  $idDominioPermiso
     * @param int  $idEstructura
     * @param bool $checked
     * @param bool $soloAreasResp
     *
     * @author: Adrian Fernandez
     * @return array
     */
    public function getEstructurasHijasById(
      $idDominioPermiso = 0, $idEstructura = 0, $checked = false, $soloAreasResp = false, $noCargos=false
    )
    {
      $conn      = Zend_Registry::get('conexion');
      $iddominio = $this->global->Perfil->iddominio;
      $icon      = "true AS icono";
      // Verificar el dominio con el cual se va a trabajar
      $iddominio = $iddominio ? $iddominio : 1;

      if ($idDominioPermiso) {
        $checked = ($checked) ? "(SELECT(mod_estructuracomp.nom_filaestruc.dominiofila['$idDominioPermiso'] = 1 :: bit)
                 from  mod_estructuracomp.nom_filaestruc WHERE mod_estructuracomp.nom_filaestruc.idfila = fila.idfila)
                 AS checked," : '';
      } else {
        $checked = ($checked) ? 'false AS checked,' : '';
      }
      if ($idEstructura && $idEstructura != '') {
        $case
                  = "CASE
                                                when nomcvil.denominacion <> '' then nomcvil.denominacion
                                                when estructura.denominacion <> '' then estructura.denominacion
                                                when estructuraop.denominacion <> '' then estructuraop.denominacion
                                        END AS text";
        $join
                  = "
                    INNER JOIN mod_estructuracomp.nom_concepto nomeav
                        ON (fila.idconcepto = nomeav.idconcepto)
                    INNER JOIN mod_estructuracomp.nom_icono icono
                        ON (icono.idicono = nomeav.idicono)
                    LEFT JOIN mod_estructuracomp.dat_estructura estructura
                        ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0)
                    LEFT JOIN  mod_estructuracomp.nom_organo orgest
                        ON (orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                        ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0)
                    LEFT JOIN  mod_estructuracomp.nom_organo orgestop
                        ON (orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto)
                    LEFT JOIN mod_estructuracomp.dat_cargo cargo
                        ON (cargo.idcargo = fila.idfila AND cargo.idproyecto =0)
                                                  LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
                                                      ON (cargo.idnomcargo = nomcvil.idnomcargo )
                    ";
        $newwhere = ' fila.idfila<>fila.idpadre';
        if ($soloAreasResp) {
          $newwhere .= ' AND estructuraop.idorgano = -2';
        }
        $newwhere
          .= " AND (fila.parent_path operator (public.<@) (
                                SELECT parent_path from mod_estructuracomp.nom_filaestruc WHERE idfila = $idEstructura
                                )  AND fila.fechafin is null) ";
        if ($noCargos){
          $newwhere .= " and fila.idconcepto not in (7,10)";
        }
        $sqlresult
                = "SELECT idfila AS id, icono.icono AS icon,
                                  $checked fila.dominiofila[$iddominio] = 0 :: bit AS unchecked,
                                                  fila.idpadre AS _parent, $icon, CASE
                  WHEN (
                        SELECT COUNT(idfila)
                        FROM mod_estructuracomp.nom_filaestruc
                        WHERE idpadre = fila.idfila AND idpadre <> idfila
                        ) = 0
                  then true else false
                END AS leaf, $case
                                          FROM mod_estructuracomp.nom_filaestruc fila $join
                                          WHERE $newwhere AND fila.fechafin IS NULL order by(fila.orden)";

        $result = $conn->fetchAll($sqlresult);

        return $result;
      } else {
        echo("{'codMsg':3,'mensaje': 'No se ha seleccionado ninguna estructura.'}");
      }
    }

    /**
     * @param $idestructura
     *
     * @return array
     */
    public function obtenerNomCargoByIdEstructura($idestructura)
    {
      $objectModel = new DatEstructuraModel();

      return $objectModel->obtenerNomCargoByIdEstructura($idestructura);
    }

    /**
     * @param $idestructura
     *
     * @return mixed
     */
    function obtenerEntidadesOrgAgrupXidestructura($idestructura)
    {
      $objectModel = new EstructuraModel();

      return $objectModel->obtenerEntidadesOrgAgrupporIdestructura($idestructura);
    }

    /**
     * @param $pId
     *
     * @return array
     */
    function obtenerEstructuraXId($pId)
    {
      return $this->estructura->dameDatosEstructura($pId);
    }

    /**
     * @param $idestructura
     *
     * @return mixed
     */
    function obtenerArrIdsEstructurasHijasArbolCompleto($idestructura, $idconcepto = NULL)
    {
      return $this->estructura->obtenerArrIdsEstructurasHijasArbolCompleto($idestructura, $idconcepto);
    }

    function obtenerEstructurasDadoPadre($idpadre)
    {
      return $this->estructuraop->obtenerEstructurasDadoPadre($idpadre);
    }
  }
