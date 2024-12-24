# frozen_string_literal: true

module Api
  module V1
    class BaseController < ApplicationController
      protect_from_forgery unless: -> { request.format.json? }
      include ApiResponders
      include Pundit::Authorization
      rescue_from ActiveRecord::RecordNotFound,        with: :render_not_found
      rescue_from ActiveRecord::RecordInvalid,         with: :render_record_invalid
      rescue_from ActionController::ParameterMissing,  with: :render_parameter_missing

      private

      def permissions(resource)
        {
          can_view: policy(resource).index? || policy(resource).show? || policy(resource).fetch?,
          can_edit: policy(resource).edit? || policy(resource).create? || policy(resource).bulk_destroy? || policy(resource).fetch?
        }
      end

      def render_not_found(exception)
        render_error(exception, { message: I18n.t('api.errors.not_found') }, :not_found)
      end

      def render_record_invalid(exception)
        render_error(exception, exception.record.errors.full_messages, :bad_request)
      end

      def render_parameter_missing(exception)
        render_error(exception, { message: I18n.t('api.errors.missing_param') }, :unprocessable_entity)
      end

      def render_error(exception, errors, status)
        logger.info { exception }
        render json: { errors: Array.wrap(errors) }, status:
      end
    end
  end
end
