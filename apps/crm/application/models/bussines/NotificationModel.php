<?php

/**
 * ModulesModel
 *
 * Esta es la clase modelo que se encarga de la administracion de los modulos
 * de forma general
 *
 * @package        ERP-PCRM
 * @category       Model
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class NotificationModel extends ZendExt_Model
{
    private $_seguridad;
    private $_persona;
    private $_mail;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_seguridad = new SeguridadComunicationInterface();
        $this->_persona = new PersonaComunicationInterface();
        $this->_mail = new MailModel();
    }

    public function notify($rol, $message = "", $subject = "Gestion comercial",
        $entity = null
    ) {
        try {
            if ($this->_mail->getServerConfig()['enabled'] != "true") {
                return array('code' => 2, 'success' => true);
            }
            $rol = is_array($rol) ? $rol : [$rol];
            $users = $this->getUser($rol);
            if (count($users)) {
                $emails = $this->getPersonsEmailByUser($users, $entity);
                if (count($emails)) {
                    $result = $this->_mail->enviarCorreo(
                        $emails, $subject, $message
                    );
                    $code = 1;
                    if ($result == false) {
                        $code = 2;
                    }
                    return array('code' => $code, 'success' => true);
                }
                throw new Exception(
                    'No existen personas asigandas a los usuarios autorizados',
                    331
                );
            }
            throw new Exception(
                'No existen usuarios asigandos a los roles autorizados', 331
            );
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }

    }

    private function getUser($rol)
    {
        $result = array();
        foreach ($rol as $r) {
            $list = $this->_seguridad->getUserByRole($r);
            foreach ($list['datos'] as $l) {
                if (!in_array($l['nombreusuario'], $result)) {
                    $result[] = $l['nombreusuario'];
                }
            }
        }
        return $result;
    }

    private function getPersonsEmailByUser($idusers, $entity)
    {
        if (count($idusers)) {
            $persons = $this->_seguridad->getIdPersonsByUsers(
                $idusers, $entity
            );
            $emails = $this->_persona->getDatosContactoPersonas($persons);
            $result = [];
            foreach ($emails as $e) {
                if (!in_array($e['contacto'], $result)) {
                    $result[] = $e['contacto'];
                }
            }
            return $result;
        }
        return array();
    }

    private function checkUserDomian($users, $entity)
    {
        try {

        } catch (Exception $e) {
            throw $e;
        }
    }
}