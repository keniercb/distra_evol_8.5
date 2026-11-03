<?php


/**
 * Short description for class
 *
 * Long description for class (if any)...
 *
 * @category   PhpStorm
 * @package    gobierno
 * @subpackage Wand
 * @copyright  Copyright (c) 2005-2015 XETID (http://www.xetid.cu)
 * @license    http://framework.zend.com/license   BSD License
 * @version    Release: @package_version@
 */
class LogisticaService
{
    private $inyector;

    /**
     *
     */
    function __construct()
    {
        $this->inyector = ZendExt_IoC::getInstance()->logistica;
    }

    public function getIndicadoresByParams(array $params, $idAsKey)
    {
        try {
            return $this->inyector->getIndicadoresByParams($params, $idAsKey);

        } catch (Exception $e) {
            throw $e;
        }

    }

} 