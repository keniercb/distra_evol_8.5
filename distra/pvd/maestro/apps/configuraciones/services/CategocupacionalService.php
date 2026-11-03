<?php
/**
 * @name EstructuraconceptoService - Clase de servicios para la configuracion de de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class CategocupacionalService extends ZendExt_Model
{
    public function setUp()
    {

        parent::ZendExt_Model();
    }

    /**
     * @method obtenerConfEstructuraConcepto - Implementacion del servicio que obtiene la estructura configurada.
     * @param $idestructconcepto - Identificador de la configuracion.
     * @return Number - Identificador de la estructura configurada.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getCategoriasOcup()
    {
        return ConfCategOcupacionalesModel::getCategoriasOcup();
    }


}