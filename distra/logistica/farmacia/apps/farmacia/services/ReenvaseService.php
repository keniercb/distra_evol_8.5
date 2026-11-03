<?php

/**
 * @class      ReenvaseService
 *
 * @package    Farmacia
 * @subpackage farmacia
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    1.0
 */
class ReenvaseService extends ZendExt_Model
{
    private $modelReenvase;
    public function __construct($params)
    {
        parent::ZendExt_Model();
        $this->modelReenvase = new ReenvaseModel($params);
    }
}