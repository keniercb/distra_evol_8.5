<?php
/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 30/09/15
 * Time: 13:16
 */


class ZendExt_SAML_HTTPPost extends ZendExt_SAML_Binding{

    public function send(SAML2\Message $message){
        if ($this->destination === NULL) {
            $destination = $message->getDestination();
        } else {
            $destination = $this->destination;
        }
        $relayState = $message->getRelayState();

        $msgStr = $message->toSignedXML();
        $msgStr = $msgStr->ownerDocument->saveXML($msgStr);

        SAML2\Utils::getContainer()->debugMessage($msgStr, 'out');

        $msgStr = base64_encode($msgStr);

        if ($message instanceof SAML2\Request) {
            $msgType = 'SAMLRequest';
        } else {
            $msgType = 'SAMLResponse';
        }

        $post = array();
        $post[$msgType] = $msgStr;

        if ($relayState !== NULL) {
            $post['RelayState'] = $relayState;
        }

        return SAML2\Utils::getContainer()->postRedirect($destination, $post);
    }

    public function receive(Zend_Controller_Request_Http $request, &$sigData){
        $msg = $request->get('SAMLRequest') ? $request->get('SAMLRequest') : $request->get('SAMLResponse');
        if (!isset($msg)) {
            throw new Exception('Missing SAMLRequest or SAMLResponse parameter.');
        }

        $msg = base64_decode($msg);

        SAML2\Utils::getContainer()->debugMessage($msg, 'in');

        $document = new DOMDocument();
        $document->loadXML($msg);
        $xml = $document->firstChild;

        $msg = SAML2\Message::fromXML($xml);

        if ($request->get('RelayState')) {
            $msg->setRelayState($request->get('RelayState'));
        }

        return $msg;
    }
}