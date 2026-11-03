<?php

/**
 *
 */
class DocumentoActivoFactory extends ZendExt_Model
{

   /* private $instanceDocDepreciacion;
    private $instanceDocTraslado;
    private $instanceDocEnvReparar;
    private $instanceDocTransfAreas;
    private $instanceDocAlquiler;
    private $instanceDocBaja;
    private $instanceDocBajaVenta;
    private $instanceDocCompraModel;
    private $instanceDocActivo;
    private $instanceDocEntregaTemporal;
    private $instanceDocAjuste;
    private $instanceDocTrasladoEntrada;
    private $instanceDocAltaCompra;
    private $instanceDocPrestamo;*/

    /**
     *
     */
    private function __construct()
    {
        /*$this->instanceDocDepreciacion = null;
        $this->instanceDocTraslado = null;
        $this->instanceDocEnvReparar = null;
        $this->instanceDocTransfAreas = null;
        $this->instanceDocAlquiler = null;
        $this->instanceDocBaja = null;
        $this->instanceDocBajaVenta = null;
        $this->instanceDocActivo = null;
        $this->instanceDocCompraModel = null;
        $this->instanceDocTrasladoEntrada = null;
        $this->instanceDocEntregaTemporal = null;
        $this->instanceDocAjuste = null;
        $this->instanceDocAltaCompra = null;
        $this->instanceDocPrestamo = null;*/
    }

    /**
     *
     */
    public function getInstance($idOperacion = false, $idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {

        $referClass = self::getReferModelClass($idOperacion);
       // $nameInstance = $referClass['instance'];
        //$instance = $this->$nameInstance;
        //if (is_null($instance)) {
        $instance = new $referClass['class']($idsubsistema);
       // }
        return $instance;
    }

    /**
     *
     */
    private function getReferModelClass($idOperacion)
    {
        $operacion = false;
        if (intval($idOperacion)) {
            $comunModel = ComunAFTModel::getInstance();
            $datos = $comunModel->getDatosInterfazByIdOperacion($idOperacion);
            $operacion = $datos['idinterfaz'];
        }
        
        switch ($operacion) {
            case 1: {
                    $class = 'DocAltaCompraModel';
                    $instance = 'instanceDocAltaCompra';
                }
                break;
            case 11: {
                    $class = 'DocDepreciacionModel';
                    $instance = 'instanceDocDepreciacion';
                }
                break;
            case 12: {
                    $class = 'DocTransfEntreEntidadesModel';
                    $instance = 'instanceDocTraslado';
                }
                break;
            case 13: {
                    $class = 'DocEnviadoRepararModel';
                    $instance = 'instanceDocEnvReparar';
                }
                break;
            case 14: {
                    $class = 'DocTransferenciaEntreAreasModel';
                    $instance = 'instanceDocTransfAreas';
                }
                break;
            case 15: {
                    $class = 'DocEntregaTemporalModel';
                    $instance = 'instanceDocEntregaTemporal';
                }
                break;
            case 18: {
                    $class = 'DocBajaDesarmeModel';
                    $instance = 'instanceDocBaja';
                }
                break;
            case 3: {
                    $class = 'DocBajaVentaModel';
                    $instance = 'instanceDocBajaVenta';
                }
                break;
            case 17: {
                    $class = 'DocRecepTransfEntreEntidadesModel';
                    $instance = 'instanceDocTrasladoEntrada';
                }
                break;
            case 19: {
                    $class = 'DocAlquilerModel';
                    $instance = 'instanceDocAlquiler';
                }
                break;
            case 20: {
                    $class = 'DocInventarioModel';
                    $instance = 'instanceDocInventario';
                }
                break;
            case 21: {
                    $class = 'DocCompraModel';
                    $instance = 'instanceDocCompraModel';
                }
                break;
            case 22: {
                    $class = 'DocAjusteModel';
                    $instance = 'instanceDocAjusteModel';
                }
                break;
            case 23: {
                    $class = 'DocAjusteModel';
                    $instance = 'instanceDocAjusteModel';
                }
            case 26: {
                    $class = 'DocPrestamoModel';
                    $instance = 'instanceDocPrestamo';
                }
                break;
            case 27: {
                    $class = 'DocUsufructoModel';
                    $instance = 'instanceDocUsufructo';
                }
                break;
            case 28: {
                    $class = 'DocArrendamientoModel';
                    $instance = 'instanceDocArrendamiento';
                }
                break;
            case 29: {
                $class = 'DocDevolucionTraslado';
                $instance = 'instanceDocDevolucion';
            }
                break;
            case 35: {
                $class = 'DocTraspasoMasivoResponsabilidad';
                $instance = 'instanceDocTraspasoMasivo';
            }
                break;
            case 100:{
                $class = 'DocTeletrabajoModel';
                $instance = 'instanceDocTeletrabajoModel';
            }    break;
            default : {
                    $class = 'DocumentoActivoModel';
                    $instance = 'instanceDocActivo';
                }
                break;
        }

        return array('class' => $class, 'instance' => $instance);
    }
    
    public function confirmarDocumento($iddocumento){
        
    }

}
