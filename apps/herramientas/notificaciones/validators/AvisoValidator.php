<?php

/**
 * @author Ernesto Herrera
 *
 */
class AvisoValidator
{

    private $_contactAddresses;

    private function extractDests($post)
    {
        $dests = array();
        foreach ($post->destinatarios as $dest) {
            $dests[] = $dest->idcontacto;
        }

        return $dests;
    }

    private function extractVias($post)
    {
        $vias = array();
        foreach ($post->medios as $via => $data) {
            $vias[] = $via;
        }

        return $vias;
    }

    public function __construct($destinatarios = null, $vias = null)
    {
        $this->_contactAddresses = array();
        $values = json_decode($_POST['values']);
        $this->destinatarios = $destinatarios ? $destinatarios
            : $this->extractDests($values);
        $this->vias = $vias ? $vias : $this->extractVias($values);
        $this->integrator = ZendExt_IoC:: getInstance();
    }

    /**
     * Verifica que los destinatarios de un aviso tengan direcciones de contacto
     * según los medios por donde se enviará.
     *
     * @param boolean default true - Indica si sólo se quiere validar.
     *
     * @return boolean
     */
    public function validarDirCtosDestinatarios($onlyValidate = true)
    {
        $dests = $this->integrator->pvd->BuscarDatosContactosByArrIdPersonas(
            $this->destinatarios
        );
        $cantDests = count($dests);
        foreach ($this->vias as $viaName) {
            $via = Doctrine::getTable('NomTipocontenido')
                ->findOneByDenominacion($viaName)->viaenvio;
            $cantSinCto = 0;
            foreach ($dests as $dest) {
                if ($via != $dest['idtipomediocontacto']) {
                    $cantSinCto++;
                } else {
                    if ($onlyValidate) {
                        break;
                    }
                    $this->_contactAddresses[$viaName][] = $dest['numero'];
                }
            }
            if ($cantDests == $cantSinCto) {
                return false;
            }
        }

        return true;
    }

    public function getContactsAddresses()
    {
        return $this->_contactAddresses;
    }
}
