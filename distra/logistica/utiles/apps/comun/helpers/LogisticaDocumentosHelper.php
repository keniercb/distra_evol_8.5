<?php

/**
 * Created by JetBrains PhpStorm.
 * User: maricet
 * Date: 5/09/14
 * Time: 4:02
 * Clase que contiene todos los metodos necesarios para el
 * trabajo con documentos
 */
class LogisticaDocumentosHelper implements ISingletonClass
{

    /**
     * Variables internas de la clase
     *
     */
    private $integrator, $varglobal, $serviciosEstructComposicion,
        $serviciosConfigGenral, $serviciosSeguridad, $objDocumento;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->serviciosConfigGenral = ServiciosConfiguracionGeneralHelper::__init();
        $this->serviciosEstructComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->serviciosSeguridad = ServiciosSeguridadHelper::__init();
        $this->objDocumento = new DatDocumento();
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Una instancia unica de LogisticaDocumentosHelper
     *
     * @var LogisticaDocumentosHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class LogisticaDocumentosHelper
     *
     * @return LogisticaDocumentosHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaDocumentosHelper;
        }
        return self::$instance;
    }

    /**
     * Devuelve un id de documento dado un id de estructura
     */
    public function devuelveIddocByIdEstructura($alias, $idEntidad = '', $subsistema = LogisticaGlobal::SUBSISTEMA_INV)
    {
        //$identidad = ($padre) ? $this->BuscarPadrePorSubordinacion() : 
        //$this->BuscarHijoPorSubordinacion();
        return $this->serviciosConfigGenral->tipoDocumentoByAliasByIdestructutra($alias, $idEntidad, $subsistema);
    }

    /**
     * Devuelve las operaciones de un documento
     */
    public function devuelveDatosOperacionByIdDocumento($iddocumento)
    {
        $idoperacion = $this->objDocumento->getIdOperacionIdDocumento($iddocumento);
        if ($idoperacion) {
            return $this->serviciosConfigGenral->getOperacionesPorId($idoperacion);
        } else {
            return;
        }
    }

    /**
     * Devuelve la categoria de documento dado un id de estructura
     */

    public function devuelveCategoriaByIdEstructura($alias, $idEntidad = '',
        $subsistema = LogisticaGlobal::SUBSISTEMA_INV
    )
    {

        //$identidad = ($idEntidad) ? $this->BuscarPadrePorSubordinacion() : 
        //$this->BuscarHijoPorSubordinacion();
        return $this->serviciosConfigGenral->tipoDocumentoPorCategoriaByIdestructutra($alias, $idEntidad, $subsistema);
    }

    /**
     * Devuelve arreglo de id de documento dado un id de estructura
     */

    public function devuelveArrIddocByIdEstructura($arrAlias, $idEntidad = '',
        $subsistema = LogisticaGlobal::SUBSISTEMA_INV
    )
    {

        //$identidad = ($idEntidad) ? $this->BuscarPadrePorSubordinacion() :
        // $this->BuscarHijoPorSubordinacion();
        foreach ($arrAlias as $value) {
            $alia = explode('Log', $value);
            $subsist = ($value == 'facturaLog' || $value == 'creditoLog' || $value == 'debitoLog') ? 13 : $subsistema;
            $alias = $this->devuelveIddocByIdEstructura($value, $idEntidad, $subsist);            
            $arrIddocs[$alia[0]] = $alias->iddoc;
            $arrInfoDocs[$alias->iddoc] = array('denominacion' => $alias->denominacion,
                                                'codigo'       => $alias->codigo, 
												'iddoc' => $alias->iddoc,
												'alias' => $value
            );
        }
        return array($arrIddocs, $arrInfoDocs);
    }

    /**
     *
     * @param type $padre
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function validarCierre($padre = 0)
    {
        $fechacontable = self::getMktime($this->global->FechaContable->fecha, 'Y-m-d');

        $idestructura = ($padre == 1) ? $this->BuscarPadrePorSubordinacion() : $this->BuscarHijoPorSubordinacion();

        $idejercicio = $this->serviciosConfigGenral->getEjercicioActualSubsistema(
            $idestructura, $this->global->Subsistema->idsubsistema
        );

        $ejerc = $this->serviciosConfigGenral->obtenerEjercicio($idejercicio, $idestructura);
        $fechaejercicio = self::getMktime($ejerc[0]->fin, 'Y-m-d');

        $idperiodo = $this->serviciosConfigGenral->getPeriodoActualSubsistema(
            $idestructura, $this->global->Subsistema->idsubsistema
        );

        $periodo = $this->serviciosConfigGenral->obtenerPeriodo($idperiodo, $idestructura);
        $fechaperiodo = self::getMktime($periodo->fin1, 'Y-m-d');

        $fechasistema = self::getMktime($this->global->FechaContable->fechasist, 'Y-m-d');

        $periodo1ro = $this->serviciosConfigGenral->getPrimerPeriodo($idejercicio);

        $flag = true;

        if ($periodo1ro !== $periodo->idperiodo) {
            if ($fechaperiodo == $fechacontable) {
                if ($fechacontable < $fechasistema) {
                    throw new ZendExt_Exception('LOG021');
                }
            }
            if ($fechaejercicio === $fechacontable) {
                $flag = false;
            }
        }
        return $flag;
    }

    public function devolverEstructuraByIddoc($iddoc)
    {
        $datosMaestros = ServiciosConfiguracionGeneralHelper::__init();
        $docPrim = $datosMaestros->obtenerDocumentoPrimPorId($iddoc);
        $estructuraSubsist = $datosMaestros->getObjEstructSubsisById($docPrim->idestructurasubsist);
        $estructura = ServiciosEstructuraComposicionHelper::__init()
            ->getEstructura($estructuraSubsist->idestructuracomun);
        return $estructura;
    }

}
