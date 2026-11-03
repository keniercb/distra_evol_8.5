<?php
/**
* ZendExt_GlobalConcept_Formato
*Clase para obtener los formatos del concepto "Configuracion"
*
* @author Elianys Hurtado Sola
* @package ZendExt
* @subpackage GlobalConcept
* @copyright ERP Cuba 
* @version 1.5.0
*/
class ZendExt_GlobalConcept_Formato
{

    public $fecha;
    public $hora;
    public $fechaHora;
    public $zHoraria;
    public $lServidor;

    /**
     * Constructor de la clase
     *
     * e - Identificador de zona horaria
     * I Indica si la fecha estan en hora de ahorro de luz diurna    1 si es Hora de Ahorro de
     *    Luz Diurna, 0 de lo contrario.
     * O - Diferencia con la hora Greenwich (GMT) en horas
     * P - Diferencia con la hora Greenwich (GMT) con dos-puntos entre las horas y los minutos
     * T - Abreviacion de zona horaria
     * Z - Desplazamiento de la zona horaria en segundos. El desplazamiento para zonas horarias al oeste de UTC
     *      es siempre negativo, y el de aquellas al este de UTC es siempre positivo.
     *
     */
    public function __construct()
    {
        $this->fecha = 'd/m/Y';
        $this->hora = 'H:i:s';
        $this->fechaHora = 'd/m/Y H:i:s';
        $this->zHoraria = 'e/O/P/T/Z';
        $this->lServidor = 'php';
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

