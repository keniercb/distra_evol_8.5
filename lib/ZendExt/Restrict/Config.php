<?php
/**
 * Clase utilizada para configurar las tablas de compartimentacion.
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage Restrict
 * @category   Framework.
 * @uses       stdClass
 * @copyright  UCID
 * @version    1.0-0
 */
class ZendExt_Restrict_Config
{

    /**
     * Informacion que se desea compartimentar.
     *
     * @var stdClass
     */
    public $informationSource;

    /**
     * Dominio(s) o concepto(s) por el o los cual(es) se desea compartimentar.
     *
     * @var array
     */
    public $domain;

    /**
     * Tipo de compartimentacion.
     *
     * @var stdClass
     */
    public $restrictionType;

    /**
     * Constructor de la clase
     *
     * @param string $_aliasPcpalTbl      - Alias de la tabla principal.
     * @param string $_uriPcpalTblDS      - Identificacion unica de la tabla principal (uri de fuente de informacion).
     * @param array  $_arrayDomainIdByUri - Identificador(es) del dominio por uri(s).
     * @param string $_uriTypeRest        - Identificacion unica del tipo de criterio de compartimentacion
     *                                    (uri del tipo de criterio).
     * @param int    $_idTypeRest         - Identificador del criterio de compartimentacion.
     */
    public function __construct($_aliasPcpalTbl, $_uriPcpalTbl, $_arrayDomainIdByUri, $_uriTypeRest, $_idTypeRest)
    {
        $this->informationSource = new stdClass();
        $this->informationSource->alias = $_aliasPcpalTbl;
        $this->informationSource->uri = $_uriPcpalTbl;

        $this->domain = $_arrayDomainIdByUri;

        $this->restrictionType->id = $_idTypeRest;
        $this->restrictionType->uri = $_uriTypeRest;
    }
}
