<?php
/**
 * Created by PhpStorm.
 * User: yarcos
 * Date: 18/09/2018
 * Time: 13:39
 */

class ConfpiefirmaService extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPieFirmaDocumentoXIdEntidad($identidad, $iddocumento) {
        try {
            $obj = new ConfFirmaDocumentoModel();
            return $obj->getPieFirmaDocumentoXIdEntidad($identidad, $iddocumento);
        } catch (Exception $e) {
            throw $e;
        }
    }
}