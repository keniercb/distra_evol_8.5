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
class ZendExt_Restrict_Query_Config
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
     * @param string $_aliasPcpalTbl           - Alias de la tabla principal.
     * @param string $_uriPcpalTblDS           - Identificacion unica de la tabla principal (uri de la fuente de informacion).
     * @param array  $_arrayDomainIdByUri      - Identificador(es) del dominio por uri(s).
     * @param string $_uriTypeRest             - Identificacion unica del tipo de criterio de compartimentacion (uri del tipo de criterio).
     * @param int    $_aliasTypeRest           - Alias de la tabla del criterio de compartimentacion.
     * @param array  $arrayAliasDomainTblByUri - Alias de la tabla que almacena la relacion entre los dominios y la informacion.
     */
    public function __construct(
        $_aliasPcpalTbl, $_uriPcpalTbl, $_arrayDomainIdByUri, $_uriTypeRest, $_aliasTypeRest = null,
        $aliasDomainTblByUri = null
    )
    {
        $this->informationSource = new stdClass();
        $this->informationSource->alias = $_aliasPcpalTbl;
        $this->informationSource->uri = $_uriPcpalTbl;

        $this->domain = new stdClass();
        if (!is_array($_arrayDomainIdByUri)) {
            $_arrayDomainIdByUri = array();
        }
        $this->domain->id = $_arrayDomainIdByUri;
        if (!is_array($aliasDomainTblByUri)) {
            $aliasDomainTblByUri = array();
        }
        $this->domain->domainTblPcpalRel = $aliasDomainTblByUri;

        $this->restrictionType = new stdClass();
        if (is_null($_aliasTypeRest)) {
            $this->restrictionType->alias = $_aliasPcpalTbl;
        } else {
            $this->restrictionType->alias = $_aliasTypeRest;
        }
        $this->restrictionType->uri = $_uriTypeRest;
    }

}
