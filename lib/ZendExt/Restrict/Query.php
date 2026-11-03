<?php

/**
 * Clase utilizada para compartimentar informacion, agregando a las consultas los filtros correspondientes.
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage Restrict
 * @category   Framework.
 * @uses       ZendExt_Restrict_Query_Config, ZendExt_Restict_Query_Abstract.
 * @copyright  UCID
 * @version    1.0-0
 */
class ZendExt_Restrict_Query
{
    /**
     * Version del subpaquete.
     */
    const VERSION = '1.0-0';
    /**
     * Instancia unica de la clase.
     *
     * @var ZendExt_Restrict_Query
     */
    private static $_instance;
    /**
     * Listado asociativo de clases consultas con clases concretas de tipo ZendExt_Restict_Query_Abstract.
     *
     * @var array
     */
    protected $_queriesRestrictType
        = array(
            'Doctrine_Query'      => 'ZendExt_Restrict_Query_DQL',
            'CI_DB_active_record' => 'ZendExt_Restrict_Query_CodeIgniterDBActiveRecord',
            'ZendExt_Query_SQL'   => 'ZendExt_Restrict_Query_SQL'
        );
    /**
     * Resgistro unico de instancias de clases concretas de tipo ZendExt_Query_Restict_Abstract.
     *
     * @var array
     */
    protected $_registerQueriesRestrictConcret = array();

    /**
     * Contructor de la clase.
     *
     * @param array $_queryRestrictType , listado asociativo de clases consultas con clases concretas de tipo
     *                                  ZendExt_Query_Restict_Abstract.
     */
    private function __construct($_queriesRestrictType)
    {
        $this->_queriesRestrictType = array_merge($this->_queriesRestrictType, $_queriesRestrictType);
    }

    /**
     * Crear una instancia unica de la clase.
     *
     * @param array $_queryRestrictType , listado asociativo de clases consultas con clases concretas de tipo
     *                                  ZendExt_Query_Restict_Abstract.
     *
     * @return ZendExt_Restrict_Query, instancia de la clase.
     */
    public static function getInstance($_queriesRestrictType = null)
    {
        if (!is_array($_queriesRestrictType)) {
            $_queriesRestrictType = array();
        }
        if (!is_object(self::$_instance)) {
            self::$_instance = new self($_queriesRestrictType);
        }
        return self::$_instance;
    }

    /**
     * Restringir una consulta teniendo en cuenta la compartimentacion de la informacion.
     *
     * @param mixed                         $_queryObject       , objeto consulta
     *                                                         (Doctrine_Query, CI_DB_active_record, ZendExt_Query_SQL)
     * @param ZendExt_Restrict_Query_Config $_restrictionConfig , configuracion de la compartimentacion.
     *
     * @return mixed,
     */
    public function restrict($_queryObject, ZendExt_Restrict_Query_Config $_restrictionConfig, $idUser = null)
    {
        //Obteniendo la clase concreta de tipo ZendExt_Query_Restict_Abstract que restringe la consulta.
        $classQueryRestrictConcret = $this->_queriesRestrictType[get_class($_queryObject)];

        //Creando y registrando una instancia de la clase concreta sino existe.
        if (!is_object($this->_registerQueriesRestrictConcret[$classQueryRestrictConcret])) {
            $this->_registerQueriesRestrictConcret[$classQueryRestrictConcret] = new $classQueryRestrictConcret($this);
        }

        //Restringiendo la consulta ejecutando el metodo restrict de la clase concreta y retornando el resultado.
        return $this->_registerQueriesRestrictConcret[$classQueryRestrictConcret]->restrict(
            $_queryObject, $_restrictionConfig, $idUser
        );
    }

    public function restrictExt(
        $_queryObject, ZendExt_Restrict_Query_Config $_restrictionConfig,
        $idUser = null, $idDomain = null
    )
    {
        //Obteniendo la clase concreta de tipo ZendExt_Query_Restict_Abstract que restringe la consulta.
        $classQueryRestrictConcret = $this->_queriesRestrictType[get_class($_queryObject)];

        //Creando y registrando una instancia de la clase concreta sino existe.
        if (!is_object($this->_registerQueriesRestrictConcret[$classQueryRestrictConcret])) {
            $this->_registerQueriesRestrictConcret[$classQueryRestrictConcret] = new $classQueryRestrictConcret($this);
        }

        //Restringiendo la consulta ejecutando el metodo restrict de la clase concreta y retornando el resultado.
        return $this->_registerQueriesRestrictConcret[$classQueryRestrictConcret]->restrictExt(
            $_queryObject, $_restrictionConfig, $idUser, $idDomain
        );
    }

}
