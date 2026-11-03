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
class ZendExt_GlobalConcept_EstructuraEconomica implements ZendExt_GlobalConcept_IConcept
{

    public $idestructurae = 0;
    public $descripcion = '';
    public $idestructuraepadre = 0;
    public $idcriterioe = 0;
    public $idformato = 0;
    public $idmodeloe = 0;
    public $reiniciocmp = 0;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->contabilidad->obtenerEstructuraE($idestructura);
        $this->idestructurae = $estructura->idestructurae;
        $this->descripcion = $estructura->descripcion;
        $this->idestructuraepadre = $estructura->idestructuraepadre;
        $this->idcriterioe = $estructura->idcriterioe;
        $this->idformato = $estructura->idformato;
        $this->idmodeloe = $estructura->idmodeloe;
        $this->reiniciocmp = $estructura->reiniciocmp;
        $this->idestructuracomun = $estructura->idestructuracomun;
        $this->idusuario = $estructura->idusuario;
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
