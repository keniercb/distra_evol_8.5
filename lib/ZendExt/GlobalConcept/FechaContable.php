<?php
/**
 * ZendExt_GlobalConcept_FechaContable
 * Clase para obtener los datos del perfil por defecto del concepto "Configuracion"
 *
 * @author Elianys Hurtado Sola
 * @package ZendExt
 * @subpackage GlobalConcept
 * @copyright ERP Cuba 
 * @version 1.5.0
 */
class ZendExt_GlobalConcept_FechaContable implements ZendExt_GlobalConcept_IConcept
{

    public $idfecha = 0;
    public $fecha = '';
    public $idestructurasubsist = 0;
    public $incremento = 0;
    public $fechasist = '';
    public $precedencia = 0;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;
        $idsubsistema = $global->Subsistema->idsubsistema;
        if ($idestructura && $idsubsistema) {
            $integrator = ZendExt_IoC::getInstance();
            $fecha = $integrator->datosmaestros->fechaContableSubsistemaObj($idestructura, $idsubsistema);
            if ($fecha->idfecha) {
                $this->idfecha = $fecha->idfecha;
                $this->fecha = $fecha->fecha;
                $this->incremento = $fecha->incremento;
                $this->idestructurasubsist = $fecha->idestructurasubsist;
                $this->fechasist = $fecha->fechasist;
                $this->precedencia = $fecha->precedencia;
            }
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
