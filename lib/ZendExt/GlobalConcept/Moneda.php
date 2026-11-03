<?php
/**
 * ZendExt_GlobalConcept_Moneda
 *Clase para obtener los datos del perfil por defecto del concepto "Configuracion"
 *
 * @author Elianys Hurtado Sola
 * @package ZendExt
 * @subpackage GlobalConcept
 * @copyright ERP Cuba 
 * @version 1.5.0
 */
class ZendExt_GlobalConcept_Moneda implements ZendExt_GlobalConcept_IConcept
{
    public $idmonedacontable = 0;
    public $idpais = 0;
    public $idmoneda = 0;
    public $descripcion = '';
    public $monaltern = 0;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $integrator = ZendExt_IoC::getInstance();
        $moneda = $integrator->datosmaestros->buscarMonedaContable();
        if ($moneda->idmonedacontable) {
            $this->idmonedacontable = $moneda->idmonedacontable;
            $this->idpais = $moneda->idpais;
            $this->idmoneda = $moneda->idmoneda;
            $this->descripcion = $moneda->descripcion;
            $this->monaltern = $moneda->monaltern;
        }
    }

    /**
     * Método para obtener el concepto
     * @return $this
     */
    public function ObtenerConcepto()
    {
        return $this;
    }
}

