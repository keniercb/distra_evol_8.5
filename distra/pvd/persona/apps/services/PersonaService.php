<?php

/**
 * Class PersonaService
 */
class PersonaService extends ZendExt_Model
{
    /**
     * @var
     */
    protected $objPersona, $objRegimen;

    /**
     *
     */
    function __construct()
    {
        $this->objPersona = new DatPersonaModel();
        $this->objRegimen = new DatRegimentrabajoModel();

    }

    /**
     * @throws ZendExt_Exception
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Servicio para obtener los datos de la persona para el cliente de mensajeria
     *
     * @param $idpersona
     *
     * @return array
     * @throws Exception
     */
    public function getDatosToJabber($idpersona)
    {
        try {

            return $this->objPersona->getDatosToJabber($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    /**
     * Servicio para obtener la foto de la persona
     *
     * @param $idpersona
     *
     * @return array
     * @throws Exception
     */
    public function getFotoToPersona($idpersona)
    {
        try {

            return $this->objPersona->getDatosToJabber($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $objDoctrineQuery
     * @param $aliasTablaReferencia
     * @param $aliasTabla
     * @param $includeDqlSelect
     *
     * @return Doctrine_Query
     * @throws Exception
     */
    public function agregarDqlDatosPersona(
        $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect, $includeTablas, $relation
    )
    {
        try {
            $agregarDqlDatosPersona = $this->objPersona->agregarDqlDatosPersona(
                $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect, $includeTablas, $relation
            );

            return $agregarDqlDatosPersona;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @return string
     * @throws Exception
     */
    public function mostrarIUPerfilSeguridadPersona()
    {
        $phtml
            = '<link href="/pvd/persona/views/js/perfilpersona/perfilpersona.css" media="screen" rel="stylesheet"
                    type="text/css" >';
        $phtml .= '<script type="text/javascript" src="/pvd/persona/views/js/perfilpersona/perfilpersona.js"></script>';

        return $phtml;
    }

    /**
     * @return string
     */
    function mostrarIUBuscarPersona()
    {
        $phtml = '<script type="text/javascript" src="/pvd/comun/views/js/utiles/searchComboBox.js"></script>';
        $phtml
            .= '<link href="/pvd/persona/views/ext/ComboBoxBtn/ComboBoxBtn.css" media="screen" rel="stylesheet"
                    type="text/css" >';
        $phtml .= "<script type='text/javascript' src='/pvd/persona/views/ext/ComboBoxBtn/ComboBoxBtn.js'></script>";
        $phtml .= "<script type='text/javascript' src='/pvd/persona/views/js/buscarpersona/buscarpersona.js'></script>";
        $phtml .= "<script type='text/javascript' src='/pvd/comun/views/js/utiles/treeComboBox.js'></script>";

        return $phtml;
    }

    /**
     * @return string
     */
    function mostrarIUBuscarEstructura()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;

        return file_get_contents($dirapps . 'pvd/comun/views/scripts/buscarestructuracomp/buscarestructuracomp.phtml');
    }

    /**
     * @param $arrIdPersonas
     *
     * @return Doctrine_Collection|Doctrine_Exception|Exception
     * @throws Exception
     */
    public function BuscarPersonasArregloId(array $arrIdPersonas)
    {
        try {
            return $this->objPersona->DevolverPersonasArregloId($arrIdPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $idpersona
     * @param      $idcategoria
     * @param null $filtro
     * @param      $limit
     * @param int $start
     * @param null $identidad
     * @param null $idcargo
     *
     * @throws Exception
     */
    public function getPrincipalesDatosPersona(
        $idpersona, $filtro = null, $limit = null, $start = 0, $identidad = null, $idcargo = null, $idestructura = null, $boolfoto, $boolcargo, $boolcategoria, $boolregimen
    )
    {
        try {
            $principalesDatosPersonaById = $this->objPersona->getPrincipalesDatosPersonaById(
                $idpersona, $filtro, $limit, $start, $identidad, $idcargo, $idestructura, $boolfoto, $boolcargo, $boolcategoria, $boolregimen
            );
            return $principalesDatosPersonaById;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $idpersona
     * @param null $limit
     * @param int $start
     * @param null $all
     *
     * @throws Exception
     */


    public function getCuentaBancaria($idpersona, $limit = null, $start = 0, $all = null)
    {
        try {
            $objModel = new DatCuentabancariaModel();

            return $objModel->getCuentaBancariaByPersona($idpersona, $limit, $start, $all);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param Doctrine_Query $objDQ
     * @param                $arrayClases
     *
     * @throws Doctrine_Exception
     * @throws Exception
     * @return Doctrine_Query
     */
    public function syncClasesDomain(Doctrine_Query $objDQ, $arrayClases)
    {
        try {
            foreach ($arrayClases as $v) {
                $union = isset($v['union']) ? mb_strtolower($v['union'], 'UTF-8') : 'leftjoin';
                switch ($union) {
                    case 'leftjoin':
                        $objDQ->leftJoin($v[relacion]);
                        break;
                    default:
                        $objDQ->innerJoin($v[relacion]);
                        break;
                }
            }

            return $objDQ;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addDQLPersona(
        Doctrine_Query &$objDQ, $aTR, $aliasTablas, $typeR = 'leftJoin', $inDQL = false, $inOT = false
    )
    {
        $objDomain = new DatPersona();
        $objDomain->addDQLPersona($objDQ, $aTR, $aliasTablas, $typeR, $inDQL, $inOT);
    }

    public function addPersona(array $persona, array $fotos)
    {
        return $this->objPersona->addPersonaCollection($persona, array('DatFoto' => $fotos));
    }

    public function getRegimenByPerson($idpersona, $filtro, $limit, $start)
    {
        try {
            return $this->objRegimen->getRegimenByPerson($idpersona, $filtro, $limit, $start);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getMediosByPerson($idpersona)
    {
        $obj = new DatPersonamedioModel();
        return $obj->getMediosByPerson($idpersona);
    }

    public function obtenerIngresoPorPersona($idpersona)
    {
        $obj = new DatIngresoModel();
        return $obj->obtenerIngresoPorPersona($idpersona);
    }

    public function getObservacion($idpersona)
    {
        $obj = new DatObservacionModel();
        return $obj->getObservacion($idpersona);
    }

    public function getCategoriaPersona($idPersona)
    {
        $objCategoria = new DatCategorizacionModel();

        return $objCategoria->getCategoriasByPersonas($idPersona);
    }

    public function getDireccionesByPersona(array $idpersona, $filtro, $limit, $start)
    {
        $obj = new DatDireccionModel();
        return $obj->getDireccionesByPesona($idpersona, $filtro, $limit, $start);
    }

    public function getDocIdentidadByPersona(array $idpersona, $filtro, $limit, $start)
    {
        $obj = new DatDocidentidadModel();
        return $obj->getDocIdentidad($idpersona, $filtro, $limit, $start);
    }

    public function getTallajesByPersona(array $idpersona)
    {
        $obj = new DatTallajeModel();
        return $obj->getTallajesByPersona($idpersona);
    }

    public function getNombreApellidos($idpersona)
    {
        try {
            $sql = "SELECT nombre, snombre, papel, sapel
                    FROM mod_persona.dat_persona 
                    WHERE idpersona = {$idpersona}";
            $query = Doctrine_Manager::getInstance();
            $res = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

            foreach ($res as $llave => $valor) {
                if ($res[$llave]['snombre'] != null) {
                    $res[$llave]['nombreapellidos'] = $res[$llave]['nombre'] . ' ' . $res[$llave]['snombre'] . ' ' .
                        $res[$llave]['papel'] . ' ' . $res[$llave]['sapel'];
                } else {
                    $res[$llave]['nombreapellidos'] = $res[$llave]['nombre'] . ' ' . $res[$llave]['papel'] . ' ' .
                        $res[$llave]['sapel'];
                }
            }

            return $res;

        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerDatosContacto(array $idpersona)
    {
        $obj = new DatContactoModel();
        return $obj->getContactos($idpersona);
    }

    public function obtenerNacionalidades($idpersona)
    {
        $obj = new DatNacionalidadModel();
        return $obj->getNationalityByIdperson($idpersona);
    }

    public function obtenerCiudadanias(array $idpersona)
    {
        $obj = new DatCiudadaniaModel();
        return $obj->getCiudadaniasByPersona($idpersona);
    }

    public function getLanguageByIdperson($idpersona)
    {
        $obj = new DatIdioma();
        return $obj->getIdiomasByIdperson($idpersona);
    }

    public function getTrayectoriaLaboralByPersona($idpersona)
    {
        $obj = new HisTrayectorialaboralModel();
        return $obj->getTrayectoriaLaboralByPersona($idpersona);
    }

    public function getSitDefensaByPersona(array $idpersona)
    {
        $obj = new DatSituaciondefensaModel();
        return $obj->getSituacionDefensa($idpersona);
    }

    public function getSituacExcep(array $idpersona)
    {
        $obj = new DatSituacexcepModel();
        return $obj->getSituacExcep($idpersona);
    }

    public function getDatosFenotipicosPersona(array $idpersona)
    {
        $obj = new DatPersonaModel();
        try {
            $resultado = $obj->getColorPiel($idpersona);
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosIntegracionPoliticaPersona(array $idpersona)
{
    $obj = new DatPersonaModel();
    try {
        $resultado = $obj->getIntegracionPolitica($idpersona);
        return $resultado;
    } catch (Exception $e) {
        throw $e;
    }
}
 public function getPrincipalesDatosPersonaEvaluaciones(
        $idpersona, $filtro = null, $limit = null, $start = 0, $identidad = null, $idcargo = null, $idestructura = null
    )
    {
        try {
            $principalesDatosPersonaById = $this->objPersona->getPrincipalesDatosByIdEvaluaciones(
                $idpersona, $filtro, $limit, $start, $identidad, $idcargo, $idestructura
            );
            return $principalesDatosPersonaById;
        } catch (Exception $e) {
            throw $e;
        }
    }
    public function obtenerCorreoByPers($idpersona, $todos) {
        try {
            $obj = new DatContactoModel();
            return $obj->obtenerCorreoByIdpPers($idpersona, $todos);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getSancionesByPersona($idpersona) {
        try {
            $obj = new DatSancion();
            return $obj->getSancionesByPersona($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCondecoracionesByPersona($idpersona) {
        try {
            $obj = new DatCondecoracion();
            return $obj->getCondecoracionesByPersona($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEducacionByPersona($idpersona) {
        try {
            $obj = new DatEducacion();
            return $obj->getEducacionByPersona($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNivelEduByPersona($idpersona) {
        try {
            $obj = new DatNiveleducacional();
            return $obj->getNivelEduByPersona($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCategoriasByPersona($idpersona) {
        try {
            $obj = new DatCategorizacion();
            return $obj->getCategoriasByPersona($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getAfiliacionesByPersona($idpersona) {
        try {
            $obj = new DatAfiliacion();
            return $obj->getAfiliacionesByPersona($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosPersonaByArrayId($arraypersonas, $nacionalidades, $contactos, $organizaciones) {
        try {
            $obj = new DatPersonaModel();
            return $obj->getDatosPersonaByArrayId($arraypersonas, $nacionalidades, $contactos, $organizaciones);
        } catch (Exception $e) {
            throw $e;
        }
    }
}
