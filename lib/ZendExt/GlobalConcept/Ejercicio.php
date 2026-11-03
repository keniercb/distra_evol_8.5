<?php

/**
 * ZendExt_GlobalConcept_Ejercicio
 * Clase para obtener el concepto "Ejercicio"
 *
 * @author Elianys Hurtado Sola
 * @package ZendExt
 * @subpackage GlobalConcept
 * @copyright ERP Cuba
 * @version 1.5.0
 */
class ZendExt_GlobalConcept_Ejercicio implements ZendExt_GlobalConcept_IConcept
{
    public $ejercicioactual = 0;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $register = Zend_Registry::getInstance();
        if ($register->cierreactual)
            $this->ejercicioactual = $register->cierreactual->idejercicioactual;
        else {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
            $idsubsistema = $register->id_subsistema_pacsoft_instanciado;
            if (!$idsubsistema)
                $idsubsistema = $global->Subsistema->idsubsistema;
            if ($idestructura && $idsubsistema) {
                $integrator = ZendExt_IoC::getInstance();
                $cierreactual = $integrator->datosmaestros->cierreActualSubsistema($idestructura, $idsubsistema);
                if ($cierreactual->idperiodoactual) {
                    $register->cierreactual = $cierreactual;
                    $this->ejercicioactual = $cierreactual->idejercicioactual;
                }
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


