<?php

/**
* ZendExt_GlobalConcept_Configuracion
* Clase para obtener el concepto "Configuracion"
*
* @author Elianys Hurtado Sola
* @package ZendExt
* @subpackage GlobalConcept
* @copyright ERP Cuba 
* @version 1.5.0
*/
class ZendExt_GlobalConcept_Configuracion implements ZendExt_GlobalConcept_IConcept
{
    public $Perfil;
    public $Formato;
    public $Moneda;
    public $Ejercicio;
    public $Periodo;

    /**
     * Método para obtener el concepto
     * @return ZendExt_GlobalConcept_Configuracion
     */
    public function ObtenerConcepto()
    {
        $temp=new self();
        $temp->Formato = ZendExt_GlobalConcept_Formato::getInstance();
        $temp->Perfil = ZendExt_GlobalConcept_Perfil::getInstance();
        /*$temp->Moneda = ZendExt_GlobalConcept_Moneda::getInstance();
        $temp->Perfil = ZendExt_GlobalConcept_Perfil::getInstance();
        $temp->Perfil = ZendExt_GlobalConcept_Perfil::getInstance();*/
        return $temp;
    }
}


