<?php


class NotificationController extends ZendExt_Controller_Secure
{
    private $_model;

    function init()
    {
        $this->_model = new NotificationModel();
        parent::init();
    }

    public function notificationAction()
    {
        $this->render();
    }

    public function notifyAction()
    {
        $params = $this->_request->getParams();
        $rol = json_decode($params['role']);
        $msg = $params['msg'];
        $subject = $params['subject'];
        $entity = $params['entity'];
        $result = $this->_model->notify($rol, $msg, $subject, $entity);
        echo json_encode($result);
    }
}
