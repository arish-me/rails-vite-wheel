Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Use `*` for development or restrict origins in production
    origins '*'

    # Allow resources with a dynamic condition
    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'],
             if: ->(env) { env['HTTP_GALAXY_HEADER'] == 'arish' }
  end
end
