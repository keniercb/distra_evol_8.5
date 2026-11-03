<?php

/**
 * ZendExt_GlobalConcept_Perfil
 * Clase para obtener los datos del perfil por defecto del concepto "Configuracion"
 *
 * @author Elianys Hurtado Sola
 * @package ZendExt
 * @subpackage GlobalConcept
 * @copyright UCID 
 * @version 1.5.0
 */
class ZendExt_GlobalConcept_Perfil
{
    public $tema = 'default';
    public $denTema = 'Estándar';
    public $portal = 'desktopaction';
    public $idioma = 'es';
    public $usuario = 'anonimo';
    public $idestructuracomun = 0;
    public $denomestructuracomun = 'instalacion';
    public $certificado = 0;
    public $idusuario = 0;
    public $iddominio = 0;
    public $identidad = 0;
    public $accesodirecto = 0;
    public $idpersona = 0;
    public $nombre = ' ';
    public $sexo = ' ';
    public $apellidos = ' ';
    public $foto = '';
    public $dentema = '';
    public $caduca = 0;
    public $idrol = 0;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $register = Zend_Registry::getInstance();
        $perfil = (isset ($register->session)) ? $register->session->perfil : NULL;
        if ($perfil) {
            $this->caduca = $perfil['caduca'];
            $this->usuario = $perfil['usuario'];
            $this->tema = $perfil['tema'];
            $this->denTema = $perfil['dentema'];
            $this->portal = $perfil['portal'];
            $this->idioma = $perfil['idioma'];
            $this->idestructuracomun = (isset($register->session->entidad->idestructura)) ?
                $register->session->entidad->idestructura : NULL;
            $this->denomestructuracomun = (isset($register->session->entidad->idestructura)) ?
                $register->session->entidad->idestructura : NULL;
            $this->identidad = (isset($perfil['identidad'])) ? $perfil['identidad'] : null;
            $this->idusuario = $perfil['idusuario'];
            $this->iddominio = $perfil['iddominio'];
            $this->dentema = $perfil['dentema'];
            $this->certificado = $register->session->certificado;
            $this->idrol = $perfil['idrol'];
            $this->accesodirecto = $perfil['cantidad'];
            $this->idpersona = $perfil['idpersona'];
            $this->nombre = $perfil['nombre'];
            $this->sexo = $perfil['sexo'];
            $this->apellidos = $perfil['apellidos'];
            $this->foto = $perfil['foto'];
            if (isset($perfil['dinamico']))
                foreach ($perfil['dinamico'] as $camposdinamicos)
                    $this->$camposdinamicos = $perfil[$camposdinamicos];
        }
    }

    /**
     * Método que permite obtener el concepto
     * @return $this
     */
    public function ObtenerConcepto()
    {
        return $this;
    }

}