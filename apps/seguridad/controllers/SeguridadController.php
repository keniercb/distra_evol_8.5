<?php

class SeguridadController extends ZendExt_Controller_Secure
{
    /**
     * @method init() - Constructor de la clase.
     * @return void
     */
    public function init()
    {
        parent::init();
        if(!$this->validateUserAccess()){
            throw new ZendExt_Exception('IPLOGACCESS');
        }
    }

    private function validateUserAccess(){
        $queryUser = Doctrine_Query::create()->from('SegUsuario su')->select('su.ip, su.isadmin')
            ->where('su.idusuario =?', array($this->global->Perfil->idusuario))->fetchOne();
        /*return ($this::ipMatch(ZendExt_App::ipRealPcCliente(), $queryUser->ip));*/
        return $queryUser->isadmin == 1 ? true : false;
    }

    /**
     * Checks if a given IP address matches the specified CIDR subnet/s
     *
     * @param string $ip The IP address to check
     * @param mixed $cidrs The IP subnet (string) or subnets (array) in CIDR notation
     * @return boolean TRUE if the IP matches a given subnet or FALSE if it does not 
     */
    private function ipMatch($ip, $cidrs) {
        $ip = explode(',',$ip)[0];
        $cidrsAll = explode(',',$cidrs);
        foreach((array) $cidrsAll as $cidr) {
            list($subnet, $mask) = explode('/', $cidr);
            $ipReal = explode('.',$ip);
            $ipVerificar = explode('.',$subnet);
            if ($mask == '8' || $mask == '16') {
                return false;
                /*if (($ipReal[0] == $ipVerificar[0])) {
                    return true;
                }*/
            } /*elseif ($mask == '16') {
                if (($ipReal[0] == $ipVerificar[0])
                    && ($ipReal[1] == $ipVerificar[1])
                ) {
                    return true;
                }
            }*/ elseif ($mask == '24') {
                if (($ipReal[0] == $ipVerificar[0])
                    && ($ipReal[1] == $ipVerificar[1])
                    && ($ipReal[2] == $ipVerificar[2])
                ) {
                    return true;
                }
            }elseif ($mask == '29') {
                if (($ipReal[0] == $ipVerificar[0])
                    && ($ipReal[1] == $ipVerificar[1])
                    && ($ipReal[2] == $ipVerificar[2])
                    && (($ipReal[3] - $ipVerificar[3])<=6)
                ) {
                    return true;
                }
            } else {
                if (($ipReal[0] == $ipVerificar[0])
                    && ($ipReal[1] == $ipVerificar[1])
                    && ($ipReal[2] == $ipVerificar[2])
                    && ($ipReal[3] == $ipVerificar[3])
                ) {
                    return true;
                }
            }
            /*if(((ip2long($ip) & ($mask = ~ ((1 << (32 - $mask)) - 1))) == (ip2long($subnet) & $mask))) {
                return true;
            }*/
        }
        return false;
    }
}